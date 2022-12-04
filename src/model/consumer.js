const mongoose = require('mongoose')

const consumerSchema = new mongoose.Schema({
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
    contact: {
        type: Number,
        required: true
    },
    mailId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    type: {
        type: Number,   // TYpe of consumer based on consumer type table (optional)
    },
    status: {
        type: Number,
        default: 1   // 1 - Active, 2 - Deleted
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
    modifiedBy: {
        type: Date
    }
})

module.exports = mongoose.model('consumer', consumerSchema)