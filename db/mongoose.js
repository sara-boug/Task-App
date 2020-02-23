var mongoose= require("mongoose");

mongoose.connect(process.env.DB_UR, {
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology: true
})
