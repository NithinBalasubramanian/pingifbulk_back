const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)

// Employee type based routes
EmployeeRouter.get('/fetchEmployeeType', Auth, controller.employeeController.listEmployeeType)
EmployeeRouter.post('/addEmployeeType', Auth, controller.employeeController.addEmployeeType)
EmployeeRouter.get('/fetchEmployeeTypeById/:id', Auth, controller.employeeController.fetchEmployeeTypeById)
EmployeeRouter.post('/updateEmployeeType/:id', Auth, controller.employeeController.updateEmployeeType)
EmployeeRouter.get('/updateEmployeeTypeStatus/:id/:status', Auth, controller.employeeController.updateEmployeeTypeStatus)

// Employee based routes
EmployeeRouter.post('/addEmployee', Auth, controller.employeeController.addEmployeeData)
EmployeeRouter.get('/fetchEmployeeById/:id', Auth, controller.employeeController.fetchEmployeeById)
EmployeeRouter.post('/updateEmployee/:id', Auth, controller.employeeController.updateEmployeeData)
EmployeeRouter.get('/updateEmployeeDataStatus/:id/:status', Auth, controller.employeeController.updateEmployeeDataStatus)
EmployeeRouter.get('/listEmployees', Auth, controller.employeeController.listEmployees)

module.exports = EmployeeRouter