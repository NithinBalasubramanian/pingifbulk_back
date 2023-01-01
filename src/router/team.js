const express = require('express');
const controller = require('../controller')
const Auth = require('../middleware/Auth');

const TeamRouter = express();

TeamRouter.get('/',controller.teamController.teamService)
TeamRouter.get('/listTeams', Auth, controller.teamController.listteams)
TeamRouter.get('/listTeam/:id', Auth, controller.teamController.listTeam)
TeamRouter.post('/addTeam', Auth, controller.teamController.teamAdd)
TeamRouter.post('/teamUpdate/:id', Auth, controller.teamController.teamUpdate)
TeamRouter.post('/teamStatusUpdate/:id', Auth, controller.teamController.teamStatusUpdate)

TeamRouter.get('/fetchTeamTypes', Auth, controller.teamController.listTeamTypes)
TeamRouter.post('/addTeamType', Auth, controller.teamController.addTeamType)
TeamRouter.get('/fetchTeamTypeById/:id', Auth, controller.teamController.fetchTeamById)
TeamRouter.post('/updateTeamType/:id', Auth, controller.teamController.updateTeamType)

module.exports = TeamRouter