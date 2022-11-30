const mongoose = require('mongoose');

const testSchema =  new mongoose.Schema({
    test: String
});

//model

const Pingifbulk = mongoose.model('Pingifbulk',testSchema);

module.exports = Pingifbulk;