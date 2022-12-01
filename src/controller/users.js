const express = require('express');
const mongoose = require('mongoose')
const jwt = require('json-web-token')

const userRoute = express();

const sendMailFunction = require('../utility/mail')
const Pingifbulk = require('../model/test')
const userRegistration = require('../model/user')

const userDb = mongoose.model('users')

// Service check
userRoute.get('/',(req,res) => {
    return res.json({
        msg : "user router successfully"
    })
})

// Register user
userRoute.post('/addUser',(req,res) => {
    const payload = req.body
    const data = new userRegistration({
        userName: payload.userName,
        userMail: payload.userMail,
        contact: payload.contact,
        password: payload.password,
    })

    // v2 #1 Replace with mail template
    const mailTemplate = `<div><p>Hi ${payload.userName}</p><div><p>Welcome to pingifbulk, Happy to part of your business</p></div></div>`
    const mailData = {
        toMailId : payload.userMail,
        subject : 'Welcome to Pingifbulk',
        content : mailTemplate
    }

    // Mail sender
    sendMailFunction(mailData)
    data.save((e) => {
        if (e) {
            return res.json({
                success: false,
                status: 400,
                msg: e
            })
        } else {
            return res.json({
                success: true,
                status: 200,
                msg: 'User registered successfully'
            })
        }
    })
    
})

// Login auth
userRoute.post('/login',(req,res) => {
    const payload = req.body
    userDb.find({ userMail : payload.userMail, password: payload.password })
        .then((data) => {
            // v1 #1 - Replace with env
            const secret = 'kjnkjnkjnjbjknknkghiuij';
            const payload = {
                'userId' : data[0]._id,
                'status' : data[0].status,
                'is_admin' : false
              };
              jwt.encode(secret, payload, function (err, token) {
                if (err) {
                  console.error(err.name, err.message);
                } else {    
                    jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
                        if (err) {
                          console.error(err.name, err.message);
                        } else {
                          console.log(decodedPayload, decodedHeader);
                        }
                      });       
                    return res.json({
                        success: true,
                        status: 200,
                        data: {
                            JWT: token,
                            userName: data[0].userName,
                            userMail: data[0].userMail
                        },
                        msg: 'Loggedin successfully'
                    })
                }   
            })
        })
        .catch(e => {
            return res.json({
                msg: 'Invalid Username or Password',
                status: 400,
                success: false
            })
        }) 
})

module.exports = userRoute