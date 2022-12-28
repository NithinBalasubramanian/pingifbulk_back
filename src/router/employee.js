const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)
EmployeeRouter.get('/fetchEmployeeType', Auth, controller.employeeController.listEmployeeType)
EmployeeRouter.post('/addEmployeeType', Auth, controller.employeeController.addEmployeeType)
EmployeeRouter.get('/fetchEmployeeTypeById/:id', Auth, controller.employeeController.fetchEmployeeById)
EmployeeRouter.post('/updateEmployeeType/:id', Auth, controller.employeeController.updateEmployeeType)

module.exports = EmployeeRouter