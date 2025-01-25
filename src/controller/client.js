const mongoose = require('mongoose')
require('../model/client')
const clientDb = mongoose.model('client')
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = {
    clientService: ((req,res) => {
        return res.json({
            msg: 'Client service working fine'
        })
    }),


    
    // Add User
    registerUser: async function(req,res) {

        const payload = req.body
        const password = payload.password
        bcrypt.hash(password, saltRounds)
            .then(hash => {
                const data = {
                    companyName: payload.userName,
                    mailId: payload.userMail,
                    contact: payload.contact,
                    password: hash,
                    status: 1,
                }

                clientDb.create(data)
                .then(resData => {
                    sendWelcomeMail(payload.userName, payload.userMail)
                    return res.json({
                        success: true,
                        status: 200,
                        msg: 'User registered successfully'
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
            .catch(e => {
                return res.json({
                    success: false,
                    status: 400,
                    msg: e
                })
            })
    },

    // Add client
    clientAdd: (async (req,res) => {
        const data = req.body
        let password = data.password
        await bcrypt.hash(password, saltRounds)
            .then(hash => {
                 password = hash;
            })
        const payloadData = {
            companyName: data.companyName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            status: 1,
            password: password,
            creatorType: 1,
            createdBy: req.user?.userId,
            createdOn: new Date()
        }

        const createdData = clientDb.create(payloadData)
        return res.json({
            success: true,
            msg: 'Client created Successfully',
            data: createdData
        })
    }),

    // Update client
    clientUpdate: ((req,res) => {
        const { id } = req.params
        const data = req.body
        const payloadData = {
            companyName: data.companyName,
            contact: data.contact,
            mailId: data.mailId,
            description: data.description,
            status: 1,
            modifiedBy: req.user?.userId,
            modifiedOn: new Date()
        }

        clientDb.updateOne({_id: id}, payloadData, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Client updated successfully',
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
    clientStatusUpdate: ((req,res) => {
        const { id, status } = req.params
        const payloadData = {
            status: status
        }
        clientDb.updateOne({_id: id}, payloadData)   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Client status updated successfully',
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

    // list client
    listClient: (async (req,res) => {
        const { search, status, type } =  req.query

        const condition = {}

        if (search && search !== '') {
            condition['companyName'] = { $regex: '.*' + search + '.*', $options: 'i' }   
        }

        if (status && status !== '') {
            condition['status'] = parseInt(status)
        }

        try {

            const data = await clientDb.aggregate([
                {
                    $match: condition
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
                    $addFields: {
                        createdBy: {
                            $cond: [
                                { $gte: [{ $size: "$createdByUser" }, 1] }, 
                                { $arrayElemAt: ["$createdByUser.userName", 0] }, // Safely extract userName from the first matched user
                                "$createdByEmployee.firstName" // Fallback if no user found
                            ]
                        }
                    }
                },
                {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true // Keep documents without a valid createdBy field
                    }
                },
                {
                    $project: {
                        _id: 1,
                        mailId: 1,
                        contact: 1,
                        status: 1,
                        companyName: 1,
                        createdBy: 1 // No remapping required here, already flattened
                    }
                },
                {
                    $sort: {
                        createdOn: 1 // Assuming "createdOn" exists for sorting
                    }
                }
            ]);
            
            if (!data) { 
                return res.json({
                    msg: 'Client fetching unsuccessful',
                    success: false,
                    status: 400
                })
            } 
            return res.json({
                data: data,
                msg: 'Client fetched successfully',
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

    // fetch Consumer by id
    fetchClientById: ((req,res) => {
        const { id } = req.params

        clientDb.find({_id: id})
        .then(resData => {
            return res.json({
                msg: 'Client fetched successfully',
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

}