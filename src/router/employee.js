const express = require('express');
const controller = require('../controller')

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)
EmployeeRouter.get('/fetchEmployeeType',controller.employeeController.listEmployeeType)
EmployeeRouter.post('/addEmployeeType',controller.employeeController.addEmployeeType)

module.exports = EmployeeRouter