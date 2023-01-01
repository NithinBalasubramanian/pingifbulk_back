const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const userRoute = express();

userRoute.get('/',controller.userController.checkService)
userRoute.post('/addUser',controller.userController.addUser)
userRoute.post('/login',controller.userController.loginAuth)
userRoute.get('/listusers', Auth, controller.userController.listUsers)
userRoute.get('/listuser/:id', Auth, controller.userController.listUser)

userRoute.get('/fetchUserType', Auth, controller.userController.listUserTypes)
userRoute.post('/addUserType', Auth, controller.userController.addUserType)
userRoute.get('/fetchUserTypeById/:id', Auth, controller.userController.fetchUserById)
userRoute.post('/updateUserType/:id', Auth, controller.userController.updateUserType)



module.exports = userRoute