const express = require('express');
const nodemailer = require('nodemailer')
const config = require('../config/mailConfig')

const mailerRouter = express();

mailerRouter.get('/',(req,res) => {
    return res.json({
        msg : 'mailer running successfully'
    })
})

mailerRouter.get('/sendmail',(req,res) => {

    const mailTemplate = '<div><p>Hi Nithin</p><div><p>This is a mail template demo test from pingifbulk</p></div></div>'
    const mailDemoData = {
        toMailId : 'nithinmigo1@gmail.com',
        subject : 'Demo Mail',
        content : mailTemplate
    }
    const state = sendMailFunction(mailDemoData)
    
        return res.json({
            msg : state
        })
})

const sendMailFunction = async (mailDetails) => {
    const mailerTransport = nodemailer.createTransport({
        service: 'gmail',
        host : 'smtp.gmail.com',
        secure : false,
        auth: {
        user: config.mailConfig.userName,
        pass: config.mailConfig.passWord
        }
    });

    const demoDetails = {
        from : "codeplayground123@gmail.com",
        to : mailDetails.toMailId,
        subject : mailDetails.subject,
        html : mailDetails.content
      }

      let state = ''

      await mailerTransport.sendMail(demoDetails, (err) => {
        if(err) {
            state = 'failed'
        } else {
            state = 'Sent successfully'
        }
    })

    return 'Sent successfully'


}

module.exports = mailerRouter