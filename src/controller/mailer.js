const express = require('express');
const sendMailFunction = require('../utility/mail')

const mailerRouter = express();

mailerRouter.get('/',(req,res) => {
    return res.json({
        msg : 'mailer running successfully'
    })
})

// Node mailer demo test
mailerRouter.get('/sendmail',(req,res) => {

    const mailTemplate = '<div><p>Hi Nithin</p><div><p>This is a mail template demo test from pingifbulk</p></div></div>'
    const mailDemoData = {
        toMailId : 'nithinmigo1@gmail.com',
        subject : 'Demo Mail',
        content : mailTemplate
    }
    const state = sendMailFunction(mailDemoData)
    state.then(() => {
        return res.json({
            msg : 'success'
        })
    }).catch(e => {
        return res.json({
            msg : 'Failed'
        })
    })
})

// Send single mail dynamic
mailerRouter.post('/mailSend',(req, res) => {
    const { content, toMail, subject } = req.body
    // console.log(req.body)
    const mailData = {
        toMailId : toMail,
        subject : subject,
        content : content
    }
    const state = sendMailFunction(mailData)
    state.then(() => {
        return res.json({
            msg : 'success',
            success: true
        })
    }).catch(e => {
        return res.json({
            msg : 'Failed',
            success: false
        })
    })
})

// Send Multiple mail dynamic
mailerRouter.post('/bulkMailSend',(req, res) => {
    const { content, toMail, subject } = req.body
    const mailData = {
        toMailId : toMail,
        subject : subject,
        content : content
    }
    const state = sendMailFunction(mailData)
    state.then(() => {
        return res.json({
            msg : 'success',
            success: true
        })
    }).catch(e => {
        return res.json({
            msg : 'Failed',
            success: false
        })
    })
})

module.exports = mailerRouter