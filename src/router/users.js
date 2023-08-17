const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const userRoute = express();

userRoute.get('/',controller.userController.checkService)
userRoute.post('/addUser',controller.userController.addUser)
userRoute.post('/login',controller.userController.loginAuth)
userRoute.get('/listusers', Auth, controller.userController.listUsers)
userRoute.get('/listuser/:id', Auth, controller.userController.listUser)
userRoute.post('/updateUserSubscription', Auth,controller.userController.updateUserSubscription)
userRoute.post('/updateUserStatus', Auth,controller.userController.updateUserStatus)

userRoute.get('/fetchUserType', Auth, controller.userController.listUserTypes)
userRoute.post('/addUserType', Auth, controller.userController.addUserType)
userRoute.get('/fetchUserTypeById/:id', Auth, controller.userController.fetchUserById)
userRoute.post('/updateUserType/:id', Auth, controller.userController.updateUserType)
userRoute.get('/updateUserTypeStatus/:id/:status', Auth, controller.userController.updateUserTypeStatus)



module.exports = userRoute