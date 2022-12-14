const mongoose = require('mongoose')
require('../model/employeeType')
const employeeTypeDb = mongoose.model('employeetypes')

module.exports = {
    checkService: ((req,res) => {
        return res.json({
            msg : "Employee router successfully"
        })
    }),

    // reference list all employee type
    listEmployeeType: ((req,res) => {
        const { search, status } =  req.query

        employeeTypeDb.find({status : status, typeName: { $regex: '.*' + search + '.*'}})
            .then(resData => {
                return res.json({
                    msg: 'Employee Type fetched successfully',
                    data: resData,
                    success: true,
                    status: 200
                })
            })
            .catch(e => {
                return res.json({
                    data: [],
                    msg: e,
                    success: false,
                    status: 400
                })
            })
    }),

    // add employee type
    addEmployeeType: ((req,res) => {
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            userId: 1,
            createdBy: 1
        }
        employeeTypeDb.create(data)
            .then(resData => {
                return res.json({
                    success: true,
                    status: 200,
                    msg: 'Employee type inserted successfully'
                })
            })
            .catch(e => {
                return res.json({
                    success: false,
                    status: 400,
                    msg: e
                })
            })

    })
}