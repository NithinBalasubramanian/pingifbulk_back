const mongoose = require('mongoose');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };
  
  const url = "mongodb://localhost:27017/Pingifbulk";
  mongoose.connect(url, options);
  
  mongoose.connection.on("connected", function (ref) {
    console.log("connected to mongo server.");
  });