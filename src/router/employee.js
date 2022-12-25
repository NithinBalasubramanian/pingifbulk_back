const express = require('express');
const controller = require('../controller')

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)
EmployeeRouter.get('/fetchEmployeeType',controller.employeeController.listEmployeeType)
EmployeeRouter.post('/addEmployeeType',controller.employeeController.addEmployeeType)
EmployeeRouter.get('/fetchEmployeeTypeById/:id',controller.employeeController.fetchEmployeeById)
EmployeeRouter.post('/updateEmployeeType/:id',controller.employeeController.updateEmployeeType)

module.exports = EmployeeRouter