const mongoose = require('mongoose')

const teamTypeSchema = new mongoose.Schema({
    typeName : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    status: {
        type: Number,
        default: 1,
        required: true
    },
    commonRole: {
        type: Number,
        default: 0   // 0 if not common , 1 if common can be only added by admin
    },
    userId: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,  // By user
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

module.exports = mongoose.model('teamType', teamTypeSchema)