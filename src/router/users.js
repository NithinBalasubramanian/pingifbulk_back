const express = require('express');
const controller = require('../controller')

const userRoute = express();

userRoute.get('/',controller.userController)
userRoute.get('/registerUser',controller.userController)

module.exports = userRoute