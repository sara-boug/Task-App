var express= require("express");
var router= new express.Router();
var task =require("../models/task");
var auth = require("../middleware/auth.js");

router.post("/tasks", auth ,async (req,res) =>{

  try {
    var Task=new task({
      ...req.body,
      owner:req.user
    });
    await  Task.save();

    res.status(200).send(Task);

  }catch(error) {
    res.status(500).send(error);

  }
});
//sort=createAt:desc

router.get("/tasks",auth, async (req,res) => {
  var match ={};
  var sort= {};
  if(req.query.accomplished) {
    match.accomplished =req.query.accomplished==='true';
  }
  if(req.query.sort) {
    var part = req.query.sort.split(":");
    sort[part[0]] = part[1] ==="desc"? -1:1;
  }

  try{
    await   req.user.populate({
      path:'task',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort

      }
    }).execPopulate();
    res.send(req.user.task)

  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/tasks/:id",  auth,async (req, res) => {
  try {
    var one_task=  await task.findById({_id:req.params.id ,
      owner:req.user
    })
    if(!one_task){
      return res.status(404).send();
    }
    var result =await task.countDocuments({});
    res.send(one_task);

  } catch(error) {
    res.status(500).send(error);

  }
});
router.patch("/tasks/:id",  auth,async(req, res) => {
  var inputs = Object.keys(req.body);
  var allowedInput=["accomplished" , "task", "date"];
  var allowed= inputs.every((input) => {
    return  allowedInput.includes(input);
  });
  if(!allowed){
    res.status(404).send();
  }
  try {
    var Task= await task.findOne({ _id: req.params.id ,
      owner: req.user });
      inputs.forEach((input) => {

        Task[input] = req.body[input]
      });
      await Task.save();
      if(!Task) {
        return res.status(404).send();

      }
      res.send(Task);

    }catch(error) {
      res.status(500).send(error);
    }
  });
  router.delete("/tasks/:id", auth ,async (req, res) => {
    try {
      var Task = await task.findOneAndDelete({_id:req.params.id,
        owner:req.user });
        if(!Task) {
          return  res.status(404).send();
        }
        res.send(Task);
      } catch(error){
        res.status(500). send(error)
      }

    })

    module.exports=router;
