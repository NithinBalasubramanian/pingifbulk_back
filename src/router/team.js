const express = require('express');
const controller = require('../controller')

const TeamRouter = express();

TeamRouter.get('/',controller.teamController.teamService)
TeamRouter.get('/listTeams',controller.teamController.listteams)
TeamRouter.get('/listTeam/:id',controller.teamController.listTeam)
TeamRouter.post('/addTeam',controller.teamController.teamAdd)
TeamRouter.post('/teamUpdate/:id',controller.teamController.teamUpdate)
TeamRouter.post('/teamStatusUpdate/:id',controller.teamController.teamStatusUpdate)


module.exports = TeamRouter