const express = require('express');
const controller = require('../controller');
const Auth = require('../middleware/Auth');

const clientRouter = express();

clientRouter.get('/',controller.clientController.clientService)
clientRouter.get('/listClient', Auth,controller.clientController.listClient)
clientRouter.post('/clientAdd', Auth, controller.clientController.clientAdd)
clientRouter.get('/fetchClientById/:id', Auth,controller.clientController.fetchClientById)
clientRouter.post('/clientUpdate/:id', Auth, controller.clientController.clientUpdate)
clientRouter.get('/clientStatusUpdate/:id/:status', Auth, controller.clientController.clientStatusUpdate)


module.exports = clientRouter