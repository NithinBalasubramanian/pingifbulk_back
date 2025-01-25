const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    companyName: {
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
    clientSubscriptionId: {
        type: mongoose.Types.ObjectId,
    },
    subscribedDate: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1   // 1 - Active, 2 - Deleted, 3 - Blocked
    },
    creatorType: {
        type: Number,  // 1 - User , 2 - Employee
        default: 1  // @todo change once employee login
    },
    createdBy: {
        type: mongoose.Types.ObjectId,  // By user id or staff of user id
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

module.exports = mongoose.model('client', clientSchema)