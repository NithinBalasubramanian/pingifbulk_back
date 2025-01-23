const mongoose = require('mongoose')
require('../model/team')
require('../model/teamType')
const teamDb = mongoose.model('team')
const teamTypesDb = mongoose.model('teamType')

module.exports = {
    teamService: ((req,res) => {
        return res.json({
            msg: 'Team service working fine'
        })
    }),

    // Add team
    teamAdd: ((req,res) => {
        const data = req.body
        const teamData = {
            teamName: data.teamName.trim().replaceAll(" ", "_").toLowerCase(),
            teamUserName: data.teamName,
            description: data.description,
            teamTypeId: data.teamTypeId,
            status: 1,
            creatorType: 1,
            createdBy: req.user?.userId
        }

        const createdData = teamDb.create(teamData)
        return res.json({
            msg: 'Team Added Successfully',
            success: true,
            data: createdData
        })
    }),

    // Update team
    teamUpdate: ((req,res) => {
        const { id } = req.params
        const data = req.body
        const teamData = {
            teamName: data.teamName.trim().replaceAll(" ", "_").toLowerCase(),
            teamUserName: data.teamName,
            description: data.description,
            teamTypeId: data.teamTypeId,
            status: 1,
            creatorType: 2,
            modifiedBy: req.user?.userId,
            modifiedOn: new Date()
        }

        teamDb.updateOne({_id: id}, teamData, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Team updated successfully',
                data: resData,
                success: true,
                status: 200
            })
        })
        .catch(e => {
            return res.json({
                data: [],
                msg: e,
                success: false,
                status: 400
            })
        })
    }),

    // Change status
    teamStatusUpdate: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const data = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        teamDb.updateOne({_id: id}, data)  
        .then(resData => {
            return res.json({
                msg: 'Team status updated successfully',
                data: resData,
                success: true,
                status: 200
            })
        })
        .catch(e => {
            return res.json({
                data: [],
                msg: e,
                success: false,
                status: 400
            })
        })
    }),

    // list team based on logged user
    listteams: ((req,res) => {
        const { search, status, type } =  req.query
        const filters = {
            "teamUserName": { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            filters['status'] = status
        }

        teamDb.find(filters).sort({ createdOn: -1})
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Teams fetched successfully',
                    success: true,
                    status: 200
                })
            })
            .catch(e => {
                return res.json({
                    data: [],
                    msg: e,
                    success: false,
                    status: 400
                })
            })
    }),

    // List team data by id
    listTeam: ((req,res) => {
        const { id } =  req.params

        teamDb.find({ _id: id })
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Team fetched successfully',
                    success: true,
                    status: 200
                })
            })
            .catch(e => {
                return res.json({
                    data: [],
                    msg: e,
                    success: false,
                    status: 400
                })
            })
    }),


    // reference list all team type
    listTeamTypes: ((req,res) => {
        const { search, status } =  req.query
        const filters = {
            // "typeName": { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (status && status !== '') {
            filters['status'] = status
        }

        teamTypesDb.find(filters)
            .then(resData => {
                return res.json({
                    msg: 'Team Type fetched successfully',
                    data: resData,
                    success: true,
                    status: 200
                })
            })
            .catch(e => {
                return res.json({
                    data: [],
                    msg: e,
                    success: false,
                    status: 400
                })
            })
    }),

    // add team type
    addTeamType: ((req,res) => {
        const payload = req.body
        const { userId } = req.user
        const data = {
            typeDisplayName: payload.typeName,
            typeName: payload.typeName.trim().replaceAll(" ","_").toLowerCase(),
            description: payload.description,
            userId: userId,
            createdBy: userId
        }
        teamTypesDb.create(data)
            .then(resData => {
                return res.json({
                    success: true,
                    status: 200,
                    msg: 'Team type inserted successfully'
                })
            })
            .catch(e => {
                return res.json({
                    success: false,
                    status: 400,
                    msg: e
                })
            })

    }),

    // fetch team by id
    fetchTeamById: ((req,res) => {
        const { id } = req.params

        teamTypesDb.find({_id: id})
        .then(resData => {
            return res.json({
                msg: 'Team Type fetched successfully',
                data: resData,
                success: true,
                status: 200
            })
        })
        .catch(e => {
            return res.json({
                data: [],
                msg: e,
                success: false,
                status: 400
            })
        })
    }),

    // update team type
    updateTeamType: ((req,res) => {
        const { id } = req.params
        const { userId } = req.user
        const payload = req.body
        const data = {
            typeDisplayName: payload.typeName,
            typeName: payload.typeName.trim().replaceAll(" ","_").toLowerCase(),
            description: payload.description,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        teamTypesDb.updateOne({_id: id}, data, { upsert: true })   // upsert - inserts data if not found
        .then(resData => {
            return res.json({
                msg: 'Team type updated successfully',
                data: resData,
                success: true,
                status: 200
            })
        })
        .catch(e => {
            return res.json({
                data: [],
                msg: e,
                success: false,
                status: 400
            })
        })
    }),

    // update team type status
    updateTeamTypeStatus: ((req,res) => {
        const { id, status } = req.params
        const { userId } = req.user
        const data = {
            status: status,
            modifiedBy: userId,
            modifiedOn: new Date()
        }

        teamTypesDb.updateOne({_id: id}, data)  
        .then(resData => {
            return res.json({
                msg: 'Team type status updated successfully',
                data: resData,
                success: true,
                status: 200
            })
        })
        .catch(e => {
            return res.json({
                data: [],
                msg: e,
                success: false,
                status: 400
            })
        })
    })

}