const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
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
    employeeTypeId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: String
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
    modifiedBy: {
        type: Date
    }
})

module.exports = mongoose.model('employee', employeeSchema)