const express = require('express');
const controller = require('../controller')

const userRoute = express();

userRoute.get('/',controller.userController.checkService)
userRoute.post('/addUser',controller.userController.addUser)
userRoute.post('/login',controller.userController.loginAuth)
userRoute.get('/listusers',controller.userController.listUsers)
userRoute.get('/listuser/:id',controller.userController.listUser)

userRoute.get('/fetchUserType',controller.userController.listUserTypes)
userRoute.post('/addUserType',controller.userController.addUserType)
userRoute.get('/fetchUserTypeById/:id',controller.userController.fetchUserById)



module.exports = userRoute