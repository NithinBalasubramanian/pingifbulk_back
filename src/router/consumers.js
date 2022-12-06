const express = require('express');
const controller = require('../controller')

const consumerRouter = express();

consumerRouter.get('/',controller.consumerController.consumerService)
consumerRouter.get('/listConsumers',controller.consumerController.listConsumers)
consumerRouter.get('/listConsumer/:id',controller.consumerController.listConsumer)
consumerRouter.post('/addConsumer',controller.consumerController.consumerAdd)
consumerRouter.post('/consumerUpdate/:id',controller.consumerController.consumerUpdate)
consumerRouter.post('/consumerStatusUpdate/:id',controller.consumerController.consumerUpdate)

consumerRouter.get('/fetchConsumerType',controller.consumerController.listConsumerType)


module.exports = consumerRouter