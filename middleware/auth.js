var jwt = require("jsonwebtoken");
var  user= require("../models/user");
var auth=async  (req, res , next) => {
  try {
      var token = req.header("Authorization").replace("Bearer " ,"") ;
      var verify= jwt.verify(token, process.env.JSONWEBTOKEN);
      var User = await user.findOne({_id:verify._id , "tokens.token" :token});
      if(!User) {
         throw Error();
      }
       req.token= token;
       req.user=User;
      next();
}catch(error) {
   res.status(500).send({error :"authentificate please !!"})
}
}
module.exports= auth;
