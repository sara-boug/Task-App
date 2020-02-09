var mongoose= require("mongoose");
var validator= require("validator");
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
var task= require("./task")
var userSchema = mongoose.Schema( {
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
    unique:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email")
      }
    }
  },
  //avoid modifying the password formats lower case should not be set to true  else the hashing would be wrong

  password: {
    type:String,
    $size:220,
    required:true,
    trim:true,
    minlength:7,
    validate(value){
      if(value.includes("password")){
        throw new Error("Passowrd can not contain password")
      }
    }
  },

  tokens:[{
    token: {
      type:String,
      required:true
    }
  }]
},{  timestamps :true })
userSchema.virtual("task" ,{
  ref:"Task",
  localField:"_id",
  foreignField:"owner",

})

userSchema.pre("save" , async  function(next) {
  var user =this;
  if(user.isModified("password") || user.isNew){
    user.password= await bcrypt.hash(user.password , 8)
    console.log(user.password    + "  the length :" +user.password.length );
  }
  next();
});
userSchema.pre("remove", async function(next) {
  await  task.deleteMany({owner:this._id});
  next();

})
userSchema.statics.findByCredentials = async (email,password) => {
  var User =await  user.findOne( {email :email});
  if(!User) {
    throw new Error("Error Login" );
  }
  var isMatch=await  bcrypt.compare( password ,User.password);
  if(!isMatch) {
    throw new Error("Error login");
  }
  return User;
}

userSchema.methods.GenerateToken= async function() {
  var User = this;
  var token = await jwt.sign({_id:User._id.toString()}, "jsonwebtoken");
  var verify= jwt.verify(token, "jsonwebtoken");
  User.tokens =  User.tokens.concat({token});
  await User.save();
  return  token;

}
// in order to hide important findByCredentials
userSchema.methods.toJson = function() {
  var userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

var user= mongoose.model("user",userSchema);
module.exports= user;
