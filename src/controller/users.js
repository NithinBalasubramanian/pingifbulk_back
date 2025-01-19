// const express = require('express');
const mongoose = require('mongoose')
const jwt = require('json-web-token')

// const userRoute = express();

const sendMailFunction = require('../utility/mail')
const Pingifbulk = require('../model/test')
const userRegistration = require('../model/user')
require('../model/userType')

const userDb = mongoose.model('users')
const userTypeDb = mongoose.model('userType')

const bcrypt = require('bcrypt');
const saltRounds = 10
const encryptKey = require('../config/encryptConfig')
const jwtKey = require('../config/jwtConfig')

module.exports = {
    checkService: function(req,res) {
        return res.json({
            msg : "user router successfully"
        })
    },

    // Add User
    addUser: async function(req,res) {

        const userTypeData = await userTypeDb.aggregate([
            {
                $match: { 'typeName' : 'SuperAdmin'}
            },
            { 
                $project: {
                    _id: 1,
                }
            }
        ])
        if (!userTypeData) {
            return res.json({
                success: false,
                status: 400,
                msg: 'User type is not set'
            })
        }
        const payload = req.body
        const password = payload.password
        bcrypt.hash(password, saltRounds)
            .then(hash => {
                const data = {
                    userName: payload.userName,
                    userMail: payload.userMail,
                    contact: payload.contact,
                    password: hash,
                    type: payload.userTypeId ?? userTypeData[0]._id,
                    status: 1
                }

                userDb.create(data)
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

    // Update user subscription
    updateUserSubscription: async function(req,res) {
        const { userId } = req.user
        const payloadData = {
            consumerSubscription: req.body.subscription,
            modifiedBy: userId,
            modifiedOn: new Date()
        }
        userDb.updateOne({_id: req.body.id}, payloadData)   
        .then(resData => {
            return res.json({
                msg: 'User subsctiption updated successfully',
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
    },

    // update status of user 
    updateUserStatus : function(req,res) {
        const { id, status } = req.params
        const { userId } = req.user
        const payloadData = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }
        userDb.updateOne({_id: id}, payloadData)   
        .then(resData => {
            return res.json({
                msg: 'User subsctiption updated successfully',
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
    },

    loginAuthOld: function(req,res) {
        const payload = req.body
        userDb.find({ userMail : payload.userMail })
            .then((data) => {
                bcrypt.compare(encryptKey, data[0].password, function(err, result) {
                    if (!result) {
                        return res.json({
                            msg: 'Invalid Password',
                            status: 400,
                            success: false
                        })
                    }
                });
                // v1 #1 - Replace with env
                const secret = jwtKey.jwtSupport.secretKey;
                const payload = {
                    'userId' : data[0]._id,
                    'status' : data[0].status,
                    'is_admin' : false
                  };
                  jwt.encode(secret, payload, function (err, token) {
                    if (err) {
                      console.error(err.name, err.message);
                    } else {         
                        return res.json({
                            success: true,
                            status: 200,
                            data: {
                                JWT: token,
                                userName: data[0].userName,
                                userMail: data[0].userMail
                            },
                            msg: 'Logged in successfully'
                        })
                    }   
                })
            })
            .catch(e => {
                return res.json({
                    msg: 'Invalid Username ',
                    status: 400,
                    success: false
                })
            }) 
    },

    loginAuth: async function(req,res) {
        const payload = req.body

        const condition = { userMail : payload.userMail }

        const data = await userDb.aggregate([
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'usertypes',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'userType'
                }
            },
            {
                $unwind: '$userType'
            },
            { 
                $project: {
                    _id: 1,
                    userName: 1,
                    userMail: 1,
                    contact: 1,
                    status: 1,
                    password: 1,
                    userId: '$userType._id',
                    userType: '$userType.typeName'
                }
            },
            {
                $sort: {
                    createdOn: 1
                }
            }
        ])

        if (data.length === 0) { 
            return res.json({
                msg: 'Invalid Username ',
                status: 400,
                success: false
            })
        } 
        if (data[0].status !== 1) {
            return res.json({
                msg: 'Account is blocked',
                status: 400,
                success: false
            })
        }
        await bcrypt.compare(payload.password, data[0].password, function(err, result) {
            if (!result) {
                return res.json({
                    msg: 'Invalid Password',
                    status: 400,
                    success: false
                })
            } else {
                // v1 #1 - Replace with env
                const secret = jwtKey.jwtSupport.secretKey;
                const setData = {
                    'userId' : data[0]._id,
                    'status' : data[0].status,
                    'is_admin' : false
                };
                jwt.encode(secret, setData, function (err, token) {
                    if (err) {
                    console.error(err.name, err.message);
                    } else {         
                        return res.json({
                            success: true,
                            status: 200,
                            data: {
                                JWT: token,
                                userName: data[0].userName,
                                userMail: data[0].userMail,
                                userType: data[0].userType?.replaceAll(' ', '-')
                            },
                            msg: 'Logged in successfully'
                        })
                    }   
                })
            }
        });
        
    },

    listUsers: async function(req,res) {
        const { search, status, type } =  req.query

        const condition = {}

        if (search && search !== '') {
            condition['userName'] = { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            condition['status'] = status
        }
        
        // Aggregate method

        try {

        const data = await userDb.aggregate([
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'usertypes',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'userType'
                }
            },
            {
                $unwind: '$userType'
            },
            { 
                $project: {
                    _id: 1,
                    userName: 1,
                    userMail: 1,
                    contact: 1,
                    status: 1,
                    userType: '$userType.typeName'
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
                msg: 'User fetching unsuccessful',
                success: false,
                status: 400
            })
        } 
        return res.json({
            data: data,
            msg: 'Users fetched successfully',
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


        // Normal method

        // const filters = {
        //     "userName": { $regex: '.*' + search + '.*', $options: 'i' }
        // }

        // if (status && status !== '') {
        //     filters['status'] = status
        // }

        // userDb.find(filters).sort({ createdOn: -1})
        //     .then(resData => {
        //         return res.json({
        //             data: resData,
        //             msg: 'Users fetched successfully',
        //             success: true,
        //             status: 200
        //         })
        //     })
        //     .catch(e => {
        //         return res.json({
        //             data: [],
        //             msg: e,
        //             success: false,
        //             status: 400
        //         })
        //     })
    },
    
    listUser: function(req,res) {
        const { id } =  req.params

        userDb.find({ _id: id })
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Users fetched successfully',
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
    },

    // reference list user type
    listUserTypes: ((req,res) => {
        const { search, status } =  req.query 
        const filters = {}  
        if (search && search !== '') {  
            filters['typeName'] = { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            filters['status'] = status
        }

        userTypeDb.find(filters)
            .then(resData => {
                return res.json({
                    msg: 'User type fetched successfully',
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

    // add user type 
    addUserType: ((req,res) => {
        const payload = req.body
        const { userId } = req.user
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            createdBy: userId
        }
        userTypeDb.create(data)
            .then(resData => {
                return res.json({
                    success: true,
                    status: 200,
                    msg: 'User type inserted successfully'
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

    addUserTypeBySuperAdmin: ((req,res) => {
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
        }
        userTypeDb.create(data)
            .then(resData => {
                return res.json({
                    success: true,
                    status: 200,
                    msg: 'User type inserted successfully'
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

    // fetch user by id
    fetchUserById: ((req,res) => {
        const { id } = req.params

        userTypeDb.find({_id: id})
        .then(resData => {
            return res.json({
                msg: 'User type fetched successfully',
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

    // update user type
    updateUserType: ((req,res) => {
        const { id } = req.params
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeName: payload.typeName,
            description: payload.description,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        userTypeDb.updateOne({_id: id}, data, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'User type updated successfully',
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

    // update user type status
    updateUserTypeStatus: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const data = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        userTypeDb.updateOne({_id: id}, data)   
        .then(resData => {
            return res.json({
                msg: 'User type status updated successfully',
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

async function sendWelcomeMail(userName, userMail) {
    
        // v2 #1 Replace with mail template
        const mailTemplate = `<div><p>Hi ${userName}</p><div><p>Welcome to pingifbulk, Happy to part of your business</p></div></div>`
        const mailData = {
            toMailId : userMail,
            subject : 'Welcome to Pingifbulk',
            content : mailTemplate
        }

        // Mail sender
        await sendMailFunction(mailData)
}
