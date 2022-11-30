const express = require('express');
const controller = require('../controller')

const userRoute = express();

userRoute.get('/',controller.userController)
userRoute.post('/addUser',controller.userController)

module.exports = userRoute