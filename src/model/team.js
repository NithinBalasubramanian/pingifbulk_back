const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    teamUserName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: Number,
        required: true   // 1 - Active , 2 - In Active 
    },
    teamTypeId: {
        type: mongoose.Types.ObjectId,
        required: true  // Types based on team type
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
    modifiedOn: {
        type: Date
    }
})

module.exports = mongoose.model('team', teamSchema)