var mongoose= require("mongoose");
var jwt = require("jsonwebtoken");
var user= require("../../models/user");
var tasks= require("../../models/task");


var userID= new mongoose.Types.ObjectId();
var userID2= new mongoose.Types.ObjectId();

var token =jwt.sign({_id:userID}, process.env.JSONWEBTOKEN);
var token2 =jwt.sign({_id:userID2}, process.env.JSONWEBTOKEN);

var task= {
  _id:new mongoose.Types.ObjectId(),
   task:"writing my report",
   accomplished:false,
   owner:userID
}
var task2= {
  _id:new mongoose.Types.ObjectId(),
   task:"reading the books I bought recently",
   accomplished:false,
   owner:userID2
}

var newUser= {
  _id:userID,
  name:"saroo",
  email:"saro@gmail.com",
  password:"MApass7777!",
  tokens:[{
    token:token
  }
]
};
var newUser2= {
  _id:userID2,
  name:"saroo",
  email:"saroboug@gmail.com",
  password:"MApass7777!",
  tokens:[{
    token:token2
  }
]
};
var setUpDB = async () => {
  await user.deleteMany();
  await tasks.deleteMany();

  await new user(newUser).save();
  await new user(newUser2).save();

  await new tasks(task).save();
  await new tasks(task2).save();
}
module.exports= {
     userID, userID2, token , newUser , setUpDB, task2
}
