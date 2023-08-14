const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)

// Employee type based routes
EmployeeRouter.get('/fetchEmployeeType', Auth, controller.employeeController.listEmployeeType)
EmployeeRouter.post('/addEmployeeType', Auth, controller.employeeController.addEmployeeType)
EmployeeRouter.get('/fetchEmployeeTypeById/:id', Auth, controller.employeeController.fetchEmployeeById)
EmployeeRouter.post('/updateEmployeeType/:id', Auth, controller.employeeController.updateEmployeeType)

// Employee based routes
EmployeeRouter.post('/addEmployee', Auth, controller.employeeController.addEmployeeData)
EmployeeRouter.post('/updateEmployee/:id', Auth, controller.employeeController.updateEmployeeData)
EmployeeRouter.get('/listEmployees', Auth, controller.employeeController.listEmployees)

module.exports = EmployeeRouter