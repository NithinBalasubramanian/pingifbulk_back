const mongoose = require('mongoose');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };
  
  const url = "mongodb+srv://nithin:ocean_project@cluster0.dipmxyo.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(url, options);
  
  mongoose.connection.on("connected", function (ref) {
    console.log("connected to mongo server.");
  });