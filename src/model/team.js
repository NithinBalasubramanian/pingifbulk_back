const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    workMailId: {
        type: String,
        required: true
    },
    homeMailId: {
        type: String
    },
    workContact: {
        type: Number,
        required: true
    },
    homeContact: {
        type: Number
    },
    joinedDate: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        required: true   // 1 - Active , 2 - In Active 
    },
    type: {
        type: String,
        required: true  // Types based on employee type
    },
    creatorType: {
        type: Number,  // 1 - User , 2 - Staff
        default: 1
    },
    createdBy: {
        type: String,  // By user id or staff of user id
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    modifiedBy: {
        type: String
    },
    modifiedOn: {
        type: Date
    }
})

module.exports = mongoose.model('team', teamSchema)