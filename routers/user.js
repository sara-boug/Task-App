var express=require("express")
var router= new express.Router();
var user = require("../models/user")
var auth= require("../middleware/auth")

router.post("/users", async (req, res)=>{
  var User= new user(req.body);
  try{
    await User.save();
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
router.get("/users/me",auth, async (req,res) => {
  console.log(req.user);
     res.send(req.user);
});

router.delete("/users/me" , auth, async (req, res) => {
    try {
        await req.user.remove() ;


      res.send(user);
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
