const express = require('express');
const controller = require('../controller')

const mailerRouter = express()

mailerRouter.get('/',controller.mailerController)
mailerRouter.get('/sendmail',controller.mailerController)
mailerRouter.post('/mailSend',controller.mailerController)
mailerRouter.post('/bulkMailSend',controller.mailerController)

mailerRouter.post('/fetchMailsByType',controller.mailerController)

module.exports = mailerRouter