const mongoose = require('mongoose')

const userTypeSchema = new mongoose.Schema({
    typeDisplayName : {
        type: String,
        required: true
    },
    typeName : {
        type: String,
        required: true,
        unique: true
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
        type: mongoose.Types.ObjectId || String
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId
    },
    modifiedOn: {
        type: Date
    }
})

module.exports = mongoose.model('userType', userTypeSchema)