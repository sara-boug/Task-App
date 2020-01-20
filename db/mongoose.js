var mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/Task_App", {
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology: true
})
