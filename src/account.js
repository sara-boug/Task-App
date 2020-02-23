var sgmail= require("@sendgrid/mail");
 sgmail.setApiKey(process.env.SENDMAIL_API_KEY);

var sendWelcomeMail= (email, name) =>{
    sgmail.send({
      to:email,
      from:"sarabouglam@gmail.com",
      subject:"Welcome",
      text:`Welcome ${name}, enjoy all along with us`
    });
}
 var sendGoodByeMail =(email ,name ) => {
   sgmail.send({
     to:email,
     from:"sarabouglam@gmail.com",
     subject:"Good Bye",
     text:`Good Bye ${name}, We hope to see you soon`
 });

 }
module.exports= {
sendWelcomeMail,
sendGoodByeMail
}
