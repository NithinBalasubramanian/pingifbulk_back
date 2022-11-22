const express = require('express');
const controller = require('../controller')

const mailerRouter = express()

mailerRouter.get('/',controller.mailerController)
mailerRouter.get('/sendmail',controller.mailerController)

module.exports = mailerRouter