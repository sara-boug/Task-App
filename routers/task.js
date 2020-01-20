var express= require("express");
var router= new express.Router();
var task =require("../models/task");

router.post("/tasks", async (req,res) =>{

  try {
    var Task=new task(req.body);
    await  Task.save();
    res.status(200).send(Task);

  }catch(error) {
    res.status(500).send(error);

  }
});


router.get("/tasks", async (req,res) => {
  try{
    var tasks= await task.find({}) ;
    res.send(tasks)

  } catch(error) {

    res.status(500).send(error);
  }
});

router.get("/tasks/:id",async (req, res) => {
  try {
    var one_task=  await task.findByIdAndDelete({_id:req.params.id})
    if(!one_task){
      return res.status(404).send();
    }
    var result =await task.countDocuments({});
    res.send(one_task);

  } catch(error) {
    res.status(500).send(error);

  }
});
router.patch("/tasks/:id", async(req, res) => {
  var inputs = Object.keys(req.body);
  var allowedInput=["accomplished" , "task", "date"];
  var allowed= inputs.every((input) => {
    return  allowedInput.includes(input);
  });
  if(!allowed){
    res.status(404).send();
  }
  try {
    var Task= await task.findByIdAndUpdate(req.params.id , req.body , {new:true, runValidators:true});
    if(!Task) {
      return res.status(404).send();

    }
    res.send(Task);

  }catch(error) {
    res.status(500).send(error);
  }
});

 router.delete("/tasks/:id", async (req, res) => {
   try {
       var Task = await task.findByIdAndDelete(req.params.id);
       if(!Task) {
         return  res.status(404).send();
       }
       res.send(Task);
   } catch(error){
     res.status(500). send(error)
   }

 })

module.exports=router;
