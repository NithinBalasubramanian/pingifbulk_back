const mongoose = require('mongoose')

const userTypeSchema = new mongoose.Schema({
    typeName : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    status: {
        type: Number,
        default: 1,   // 1  active , 2 deleted , 3 blocked
        required: true
    },
    permissionType: {
        type: Number,  // 1 super admin , 2 admin
        default: 2
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: String
    },
    modifiedBy: {
        type: String
    },
    modifiedOn: {
        type: Date
    }
})

module.exports = mongoose.model('userType', userTypeSchema)