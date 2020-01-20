var mongoose= require("mongoose");
var validator= require("validator");


var user= mongoose.model("user", {
  name: {
    type:String,
    require:true,
    trim: true,
    lowercase:true
  },
  age: {
    type:Number,
    default: 0,
    validate(value){
      if(value<0){
        throw new Error("the age must be higher than 0")
      }
    }
  },
  email: {
    type: String,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email")
      }
    }
  },
  password: {
    type:String,
    trim:true,
    required:true,
    lowercase:true,
    minlength:7,
    validate(value){
      if(value.includes("password")){
        throw new Error("Passowrd can not contain password")
      }
    }
  }
});
module.exports= user;
