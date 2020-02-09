var mongoose= require("mongoose");
var schema = mongoose.Schema({
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
  owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
  }
},{  timestamps :true });
schema.pre('save',   function(next ){
     var task = this;
     next();
});
var task = mongoose.model("Task", schema);

module.exports=task
