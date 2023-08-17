const express = require('express');
const controller = require('../controller');
const Auth = require('../middleware/Auth');

const consumerRouter = express();

consumerRouter.get('/',controller.consumerController.consumerService)
consumerRouter.get('/listConsumers', Auth,controller.consumerController.listConsumers)
consumerRouter.get('/listConsumer/:id', Auth,controller.consumerController.listConsumer)
consumerRouter.post('/addConsumer', Auth, controller.consumerController.consumerAdd)
consumerRouter.post('/consumerUpdate/:id', Auth, controller.consumerController.consumerUpdate)
consumerRouter.get('/consumerStatusUpdate/:id/:status', Auth, controller.consumerController.consumerStatusUpdate)

consumerRouter.get('/fetchConsumerType', Auth, controller.consumerController.listConsumerType)
consumerRouter.post('/addConsumerType', Auth,controller.consumerController.addConsumerType)
consumerRouter.get('/fetchConsumerTypeById/:id', Auth,controller.consumerController.fetchConsumerById)
consumerRouter.post('/updateConsumerType/:id', Auth,controller.consumerController.updateConsumerType)
consumerRouter.get('/updateConsumerTypeStatus/:id/:status', Auth,controller.consumerController.updateConsumerTypeStatus)

module.exports = consumerRouter