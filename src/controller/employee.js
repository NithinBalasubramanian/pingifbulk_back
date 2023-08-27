const mongoose = require('mongoose')
require('../model/employeeType')
require('../model/employee')
const employeeTypeDb = mongoose.model('employeetypes')
const employeeDb = mongoose.model('employee')

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
    }),

    // update Employee type status
    updateEmployeeTypeStatus: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const data = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        employeeTypeDb.updateOne({_id: id}, data)  
        .then(resData => {
            return res.json({
                msg: 'Employee type  status updated successfully',
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

    // Add Employee
    addEmployeeData: ((req,res) => {
        const data = req.body
        const employeeData = {
            firstName: data.firstName,
            middleName: data.middleName ?? '',
            lastName: data.lastName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            employeeTypeId: data.employeeTypeId,
            status: 1,
            creatorType: 1,
            createdBy: req.user?.userId
        }

        const createdData = employeeDb.create(employeeData)
        return res.json({
            msg: 'Employee Added Successfully',
            data: createdData
        })
    }),

    // update EMployee 
    updateEmployeeData: ((req,res) => {
        const { id } = req.params
        const { userId } = req.user
        const data = req.body
        const employeeData = {
            firstName: data.firstName,
            middleName: data.middleName ?? '',
            lastName: data.lastName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            employeeTypeId: data.employeeTypeId,
            status: 1,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        employeeDb.updateOne({_id: id}, employeeData, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Employee updated successfully',
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

    // update EMployee status
    updateEmployeeDataStatus: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const employeeData = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        employeeDb.updateOne({_id: id}, employeeData)   
        .then(resData => {
            return res.json({
                msg: 'Employee updated successfully',
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

    // List employees
    listEmployees: (async (req,res) => {
        const { search, status, type } =  req.query
        const condition = {}

        if (search && search !== '') {
            condition['firstName'] = { $regex: '.*' + search + '.*', $options: 'i' }   
        }

        if (status && status !== '') {
            condition['status'] = parseInt(status)
        }


        try {

            const data = await employeeDb.aggregate([
                {
                    $match: condition
                },
                {
                    $lookup: {
                        from: 'employeetypes',
                        localField: 'employeeTypeId',
                        foreignField: '_id',
                        as: 'employeeType'
                    }
                },
                {
                    $unwind: '$employeeType'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdByUser'
                    }
                },
                {
                    $unwind: '$createdByUser'
                },
                {
                    $addFields: {
                        "employeeName": { $concat: ['$firstName', ' ', '$lastName']}
                    } 
                },
                { 
                    $project: {
                        _id: 1,
                        employeeName: 1,
                        mailId: 1,
                        contact: 1,
                        status: 1,
                        employeeType: '$employeeType.employeeType',
                        creatorName: '$createdByUser.userName'
                    }
                },
                {
                    $sort: {
                        createdOn: 1
                    }
                }
            ])
            if (!data) { 
                return res.json({
                    msg: 'Employee fetching unsuccessful',
                    success: false,
                    status: 400
                })
            } 
            return res.json({
                data: data,
                msg: 'Employee fetched successfully',
                success: true,
                status: 200
            })
        } catch (e) {
            return res.json({
                msg: e,
                success: false,
                status: 400
            })
        }
    })
}