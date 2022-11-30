const express = require('express');

const userRoute = express();

const sendMailFunction = require('../utility/mail')
const Pingifbulk = require('../model/test')
const userRegistration = require('../model/user')

userRoute.get('/',(req,res) => {
    return res.json({
        msg : "user router successfully"
    })
})

userRoute.post('/addUser',(req,res) => {
    const payload = req.body
    console.log(req.body)
    const data = new userRegistration({
        userName: payload.userName,
        userMail: payload.userMail,
        contact: payload.contact,
        password: payload.password,
    })
    const mailTemplate = `<div><p>Hi ${payload.userName}</p><div><p>Welcome to pingifbulk, Happy to part of your business</p></div></div>`
    const mailData = {
        toMailId : payload.userMail,
        subject : 'Welcome to Pingifbulk',
        content : mailTemplate
    }

    sendMailFunction(mailData)
    data.save((e) => {
        if (e) {
            return res.json({
                status: false,
                msg: e
            })
        } else {
            return res.json({
                status: true,
                msg: 'User registered successfully'
            })
        }
    })
    
})

module.exports = userRoute