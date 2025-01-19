const mongoose = require('mongoose')

const consumerTypeSchema = new mongoose.Schema({
    typeDisplayName : {
        type: String,
        required: true
    },
    typeName : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    orgName : {
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
        type: mongoose.Types.ObjectId,  // By user
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

module.exports = mongoose.model('consumerType', consumerTypeSchema)