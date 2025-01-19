const express = require('express');
const sendMailFunction = require('../utility/mail')

const mongoose = require('mongoose')
require('../model/consumer')
require('../model/user')
require('../model/employee')

const consumerDb = mongoose.model('consumer')
const userDb = mongoose.model('users')
const employeeDb = mongoose.model('employee')

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

// Fetch mails based on category types
mailerRouter.post('/fetchMailsByType', async (req,res) => {
    const { categoryType, typeId } = req.body

    let data = []

    try {

        switch (categoryType) {
            case '1':
                data = await consumerDb.aggregate([
                    {
                        $match: { "consumerTypeId": new mongoose.Types.ObjectId(typeId), "status": 1 }
                    },
                    {
                            $project: {
                                mailId: 1
                            }
                    }
                ])
                break;
            case '2':
                data = await userDb.aggregate([
                    {
                        $match: { "type": new mongoose.Types.ObjectId(typeId), "status": 1 }
                    },
                    {
                        $addFields: {
                            mailId: "$userMail"
                        }
                    },
                    {
                            $project: {
                                mailId: 1
                            }
                    }
                ])
                break;
            case '3':
                data = await employeeDb.aggregate([
                    {
                        $match: { "employeeTypeId":  new mongoose.Types.ObjectId(typeId), "status": 1 }
                    },
                    {
                            $project: {
                                mailId: 1
                            }
                    }
                ])
                break;
            default:
                break;
        }


        if (data.length === 0) { 
            return res.json({
                msg: 'No data found',
                success: false,
                status: 400
            })
        } 
        return res.json({
            data: data,
            msg: 'Emails fetched successfully',
            success: true,
            status: 200
        })
    } catch(e) {
        return res.json({
            msg: 'No data found',
            success: false,
            status: 400
        })
    }
})

module.exports = mailerRouter