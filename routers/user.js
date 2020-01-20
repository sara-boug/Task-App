var express=require("express")
var router= new express.Router();

var user = require("../models/user")

router.post("/users", async (req, res)=>{
  var User= new user(req.body);
  try{
    await User.save();
    res.status(200).send(User)
  }  catch(error){
    res.status(400).send(error);

  }
});

router.get("/users", async (req,res) => {
  try{
    var users=  await  user.find({})
    res.send(users)
  } catch(error){
    res.status(500).send()
  }
});

router.get("/users/:id", async (req,res) =>{

  try{
    var User=  await user.findById({_id:req.params.id});
    if(!User){
      return res.status(404).send();
    }
    res.send(User)

  } catch(error) {

    res.status(500).send();
  }

});

router.patch("/users/:id", async(req, res) => {
  var input = Object.keys( req.body);
  var allowedInputs =[ "name" ,"age" , "email", "password" ];
  var allowed = input.every((input) => {
    return allowedInputs.includes(input);
  })
  if(!allowed){
    return res.status(500).send();
  }  try {
    var User=await user.findByIdAndUpdate( req.params.id , req.body, {new:true , runValidators: true });
    if(!User) {
      return res.status(404).send();
    }
    res.send(User);
  }catch(error) {
    res.status(500).send(error)
  }

});

router.delete("/users/:id", async(req, res) => {
  try {
    var User = await user.findByIdAndDelete(req.params.id);
    if(!User) {
      res.status(404);
    }
    res.send(User);
  }catch(error){
    res.status(500).send(error)
  }
})

module.exports= router;
