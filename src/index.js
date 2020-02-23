var express= require("express");
var bcrypt = require('bcryptjs');

var app= express();
require("../db/mongoose.js");
var user = require("../models/user")
var task=require("../models/task")
var user_routs= require("../routers/user")
var task_routs= require("../routers/task")
var port= process.env.PORT;

app.use(express.json())
app.use(user_routs);
app.use(task_routs)


app.listen(port, ()=> {
  console.log("Server is up on : ", port );
})
