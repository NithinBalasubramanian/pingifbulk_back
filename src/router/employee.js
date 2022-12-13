const express = require('express');
const controller = require('../controller')

const EmployeeRouter = express()

EmployeeRouter.get('/',controller.employeeController.checkService)

module.exports = EmployeeRouter