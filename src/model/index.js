const mongoose = require('mongoose');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };
  
  const url = "mongodb+srv://pingifbulk:711015Nith@cluster0.omrh8nh.mongodb.net/test";
  mongoose.connect(url, options);
  
  mongoose.connection.on("connected", function (ref) {
    console.log("connected to mongo server.");
  });