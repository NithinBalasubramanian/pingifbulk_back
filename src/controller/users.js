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
    addUser: async function(req,res) {
        const payload = req.body
        const password = payload.password
        bcrypt.hash(password, saltRounds)
            .then(hash => {
                const data = {
                    userName: payload.userName,
                    userMail: payload.userMail,
                    contact: payload.contact,
                    password: hash,
                    type: 2
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
        const { userId } = req.user
        const payloadData = {
            status: req.body.status,
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
    loginAuth: function(req,res) {
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
                        // jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
                        //     if (err) {
                        //       console.error(err.name, err.message);
                        //     } else {
                        //       console.log(decodedPayload, decodedHeader);
                        //     }
                        //   });       
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
    listUsers: function(req,res) {
        const { search, status, type } =  req.query

        userDb.find({"userName": { $regex: '.*' + search + '.*', $options: 'i' }, status: status}).sort({ createdOn: -1})
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

        userTypeDb.find({status : status, typeName: { $regex: '.*' + search + '.*'}})
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

// // Service check
// userRoute.get('/',(req,res) => {
//     return res.json({
//         msg : "user router successfully"
//     })
// })

// // Register user
// userRoute.post('/addUser',(req,res) => {
//     const payload = req.body
//     const data = new userRegistration({
//         userName: payload.userName,
//         userMail: payload.userMail,
//         contact: payload.contact,
//         password: payload.password,
//     })

//     // v2 #1 Replace with mail template
//     const mailTemplate = `<div><p>Hi ${payload.userName}</p><div><p>Welcome to pingifbulk, Happy to part of your business</p></div></div>`
//     const mailData = {
//         toMailId : payload.userMail,
//         subject : 'Welcome to Pingifbulk',
//         content : mailTemplate
//     }

//     // Mail sender
//     sendMailFunction(mailData)
//     data.save((e) => {
//         if (e) {
//             return res.json({
//                 success: false,
//                 status: 400,
//                 msg: e
//             })
//         } else {
//             return res.json({
//                 success: true,
//                 status: 200,
//                 msg: 'User registered successfully'
//             })
//         }
//     })
    
// })

// // Login auth
// userRoute.post('/login',(req,res) => {
//     const payload = req.body
//     userDb.find({ userMail : payload.userMail, password: payload.password })
//         .then((data) => {
//             // v1 #1 - Replace with env
//             const secret = jwtKey.jwtSupport.secretKey;
//             const payload = {
//                 'userId' : data[0]._id,
//                 'status' : data[0].status,
//                 'is_admin' : false
//               };
//               jwt.encode(secret, payload, function (err, token) {
//                 if (err) {
//                   console.error(err.name, err.message);
//                 } else {    
//                     jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
//                         if (err) {
//                           console.error(err.name, err.message);
//                         } else {
//                           console.log(decodedPayload, decodedHeader);
//                         }
//                       });       
//                     return res.json({
//                         success: true,
//                         status: 200,
//                         data: {
//                             JWT: token,
//                             userName: data[0].userName,
//                             userMail: data[0].userMail
//                         },
//                         msg: 'Loggedin successfully'
//                     })
//                 }   
//             })
//         })
//         .catch(e => {
//             return res.json({
//                 msg: 'Invalid Username or Password',
//                 status: 400,
//                 success: false
//             })
//         }) 
// })

// // fetch all users
// userRoute.get('/listusers',(req,res) => {
//     const { search, status, type } =  req.query
//     console.log(search)

//     userDb.find({"userName": { $regex: '.*' + search + '.*', $options: 'i' }, status: status}).sort({ createdOn: -1})
//         .then(resData => {
//             return res.json({
//                 data: resData,
//                 msg: 'Users fetched successfully',
//                 success: true,
//                 status: 200
//             })
//         })
//         .catch(e => {
//             return res.json({
//                 data: [],
//                 msg: e,
//                 success: false,
//                 status: 400
//             })
//         })
// }) 

// // fetch all users single
// userRoute.get('/listuser/:id',(req,res) => {
//     const { id } =  req.params

//     userDb.find({ _id: id })
//         .then(resData => {
//             return res.json({
//                 data: resData,
//                 msg: 'Users fetched successfully',
//                 success: true,
//                 status: 200
//             })
//         })
//         .catch(e => {
//             return res.json({
//                 data: [],
//                 msg: e,
//                 success: false,
//                 status: 400
//             })
//         })
// }) 

// module.exports = userRoute