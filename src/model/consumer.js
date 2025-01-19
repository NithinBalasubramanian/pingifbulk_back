const mongoose = require('mongoose')

const consumerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true
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
    consumerTypeId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: String
    },
    description: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    group: {
        type: Number,   // TYpe of consumer based on consumer group table (optional)
    },
    status: {
        type: Number,
        default: 1   // 1 - Active, 2 - Deleted
    },
    creatorType: {
        type: Number,  // 1 - User , 2 - Employee
        default: 1
    },
    createdBy: {
        type: mongoose.Types.ObjectId,  // By user id or staff of user id
        required: true
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

module.exports = mongoose.model('consumer', consumerSchema)