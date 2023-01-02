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
        const filters = {
            "typeName": { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            filters['status'] = status
        }

        employeeTypeDb.find(filters)
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
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            userId: 1,
            createdBy: userId
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

    }),

    // fetch Employee by id
    fetchEmployeeById: ((req,res) => {
        const { id } = req.params

        employeeTypeDb.find({_id: id})
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

    // update Employee type
    updateEmployeeType: ((req,res) => {
        const { id } = req.params
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        employeeTypeDb.updateOne({_id: id}, data, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Employee type updated successfully',
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
    })
}