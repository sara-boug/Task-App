var mongoose= require("mongoose");
var task = mongoose.model("Task", {
  task:{
    type:String,
    require:true,
    trim:true

  },
  accomplished:{
    type:Boolean,
    default:false
  },
  date: Date,
})

module.exports=task
