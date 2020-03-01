var express=require("express")
var router= new express.Router();
var user = require("../models/user")
var auth= require("../middleware/auth")
var multer= require("multer");
var sharp = require("sharp");
var { sendWelcomeMail, sendGoodByeMail} = require("../src/account.js");

var upload = multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file , callback)  {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return   callback(new Error("please Upload a word document"));
    }
    callback(undefined, true);
  }
});

router.post("/users", async (req, res)=>{
  var User= new user(req.body);
  try{
    await User.save();
    sendWelcomeMail(User.email, User.name);
    var token =await User.GenerateToken();
    res.status(200).send({user:User , token:token})
  }  catch(error){
    res.status(400).send(error);
  }
});
router.post("/users/login", async (req, res) => {
  try{
    var User =  await user.findByCredentials(req.body.email, req.body.password);
    var token = await  User.GenerateToken();
    res.send({ user :User , token: token});
  }catch(error) {
    res.status(400).send(error);
  }
})
router.post("/users/logout" , auth,  async(req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !==req.token
    })
    await req.user.save();
    res.send();
  } catch(error){
    res.status(404).send();
  }
})
router.post("/users/logoutAll",auth,async (req, res) => {
  try{
    req.user.tokens=[];
    await req.user.save();
    res.status(200).send();
  }catch(error) {
    res.status(500).send();
  }
});


router.post("/users/me/avatar" ,auth, upload.single("upload"),  async (req, res) => {
  try {
    var avatar=  await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=avatar;
    await req.user.save();
    res.send(avatar);
  }catch(error){
    res.status(500).send();
  }
},( error, req, res, next ) => {
  res.status(400).send({error:error.message})
});
router.get("/users/me",auth, async (req,res) => {
  res.send(req.user);
});

router.delete("/users/me/avatar", auth , upload.single("upload"), async(req,res) => {
  req.user.avatar= undefined;
  await req.user.save();

  res.send();
});

// this would be to get the real imgae of the user instead of the avatar
router.get("/users/:id/avatar", async (req, res) => {
  try{
    var User= await  user.findById(req.params.id);
    if(!User || !User.avatar){
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(User.avatar);
  }catch(error){
    console.log(error);
    res.status(500).send();

  }
})
router.delete("/users/me" , auth, async (req, res) => {
  try {
    sendGoodByeMail(req.user.email, req.user.name);
   var User=    await req.user.remove();
    res.send(User);

  }catch(error) {
    console.log(error);
    res.status(500).send();
  }

});
router.get("/users/:id", async (req,res) =>{

  try{
    var User=  await user.findById(req.params.id);
    if(!User){
      return res.status(404).send();
    }
    res.send(User)
  } catch(error) {
    res.status(500).send();
  }

});

router.patch("/users/me", auth ,async(req, res) => {
  var inputs = Object.keys( req.body);
  var allowedInputs =[ "name" ,"age" , "email", "password" ];
  var allowed = inputs.every((input) => {
    return allowedInputs.includes(input);
  })
  if(!allowed){
    return res.status(500).send();

  }
  try {
    var User=await req.user;
    inputs.forEach((input) => {
      User[input]= req.body[input];
    })
    await User.save();
    if(!User) {
      return res.status(404).send();
    }
    res.send(User);

  }catch(error) {
    res.status(500).send(error)
  }

});


module.exports= router;
