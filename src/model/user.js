const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userMail: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Types.ObjectId,
    },
    status: {
        type: Number,
        default: 1   // 1 - not yet verified , 2 - verified , 3 - Blocked , 4 - Star user
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId
    },
    modifiedOn: {
        type: Date
    }
})

const userRegistration = mongoose.model('users',userSchema)

module.exports = userRegistration

