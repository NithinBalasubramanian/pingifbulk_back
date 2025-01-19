const mongoose = require('mongoose')
require('../model/consumer')
require('../model/consumerType')
const consumerDb = mongoose.model('consumer')
const consumerTypeDb = mongoose.model('consumerType')
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = {
    consumerService: ((req,res) => {
        return res.json({
            msg: 'Common service working fine'
        })
    }),

    // Add consumers
    consumerAdd: (async (req,res) => {
        const data = req.body
        let password = data.password
        await bcrypt.hash(password, saltRounds)
            .then(hash => {
                 password = hash;
            })
        const consumerData = {
            firstName: data.firstName,
            middleName: data.middleName ?? '',
            lastName: data.lastName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            consumerTypeId: data.consumerTypeId,
            status: 1,
            password: password,
            creatorType: 2,
            createdBy: req.user?.userId,
            createdOn: new Date()
        }

        const createdData = consumerDb.create(consumerData)
        return res.json({
            success: true,
            msg: 'Consumer Added Successfully',
            data: createdData
        })
    }),

    // Update consumers
    consumerUpdate: ((req,res) => {
        const { id } = req.params
        const data = req.body
        const consumerData = {
            firstName: data.firstName,
            middleName: data.middleName ?? '',
            lastName: data.lastName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            consumerTypeId: data.consumerTypeId,
            status: 1,
            creatorType: 2,
            modifiedBy: req.user?.userId,
            modifiedOn: new Date()
        }

        consumerDb.updateOne({_id: id}, consumerData, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Consumer updated successfully',
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

    // Change status
    consumerStatusUpdate: ((req,res) => {
        const { id, status } = req.params
        const consumerData = {
            status: status
        }
        consumerDb.updateOne({_id: id}, consumerData)   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Consumer status updated successfully',
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

    // list consumers based on logged user
    listConsumers: (async (req,res) => {
        const { search, status, type } =  req.query

        const condition = {
            'createdBy': new mongoose.Types.ObjectId(req.user?.userId)
        }

        if (search && search !== '') {
            condition['firstName'] = { $regex: '.*' + search + '.*', $options: 'i' }   
        }

        if (status && status !== '') {
            condition['status'] = parseInt(status)
        }

        console.log(condition)

        try {

            const data = await consumerDb.aggregate([
                {
                    $match: condition
                },
                {
                    $lookup: {
                        from: 'consumertypes',
                        localField: 'consumerTypeId',
                        foreignField: '_id',
                        as: 'consumerType'
                    }
                },
                {
                    $unwind: '$consumerType'
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
                    $lookup: {
                        from: 'employees',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdByEmployee'
                    }
                },
                {
                    $addFields: {
                        "createdBy": {
                            $cond: [
                                    { $gte: [
                                        { $size:  "$createdByUser" },
                                        1
                                    ]}, 
                                    "$createdByUser.userName",
                                    "$createdByEmployee.firstName"
                                ]
                        }
                    }
                },
                {
                    $unwind: '$createdBy'
                },
                {
                    $addFields: {
                        "consumerName": { $concat: ['$firstName', ' ', '$lastName']}
                    } 
                },
                { 
                    $project: {
                        _id: 1,
                        mailId: 1,
                        contact: 1,
                        status: 1,
                        consumerName: 1,
                        consumerType: '$consumerType.typeName',
                        createdBy: '$createdBy'
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
                    msg: 'Consumer fetching unsuccessful',
                    success: false,
                    status: 400
                })
            } 
            return res.json({
                data: data,
                msg: 'Consumer fetched successfully',
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
    }),

    // List consumer data by id
    listConsumer: ((req,res) => {
        const { id } =  req.params

        consumerDb.find({ _id: id })
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Consumer fetched successfully',
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

    // fetch Consumer by id
    fetchConsumerById: ((req,res) => {
        const { id } = req.params

        consumerDb.find({_id: id})
        .then(resData => {
            return res.json({
                msg: 'Consumer fetched successfully',
                data: resData[0],
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

    // reference list all consumer type
    listConsumerType: ((req,res) => {
        const { search, status } =  req.query
        const filters = {}
        if (search && search !== '') {
            filters['typeName'] = { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            filters['status'] = status
        }

        consumerTypeDb.find(filters)
            .then(resData => {
                return res.json({
                    msg: 'Consumer Type fetched successfully',
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


    // add consumer type
    addConsumerType: ((req,res) => {
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            orgName: payload.orgName,
            userId: 1,
            createdBy: userId
        }
        consumerTypeDb.create(data)
            .then(resData => {
                return res.json({
                    success: true,
                    status: 200,
                    msg: 'Consumer type inserted successfully'
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

    // fetch Consumer type by id
    fetchConsumerTypeById: ((req,res) => {
        const { id } = req.params

        consumerTypeDb.find({_id: id})
        .then(resData => {
            return res.json({
                msg: 'Consumer Type fetched successfully',
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

    // update Consumer type
    updateConsumerType: ((req,res) => {
        const { id } = req.params
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            orgName: payload.orgName,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        consumerTypeDb.updateOne({_id: id}, data, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Consumer type updated successfully',
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

     // update Consumer type status
     updateConsumerTypeStatus: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const data = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        consumerTypeDb.updateOne({_id: id}, data)  
        .then(resData => {
            return res.json({
                msg: 'Consumer type status updated successfully',
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