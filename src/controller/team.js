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

    // Add consumers
    teamAdd: ((req,res) => {
        return res.json({
            msg: 'Team service working fine'
        })
    }),

    // Update consumers
    teamUpdate: ((req,res) => {
        return res.json({
            msg: 'Team service working fine'
        })
    }),

    // Change status
    teamStatusUpdate: ((req,res) => {
        return res.json({
            msg: 'Team service working fine'
        })
    }),

    // list consumers based on logged user
    listteams: ((req,res) => {
        const { search, status, type } =  req.query

        teamDb.find({"firstName": { $regex: '.*' + search + '.*', $options: 'i' }, status: status}).sort({ createdOn: -1})
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

    // List consumer data by id
    listTeam: ((req,res) => {
        const { id } =  req.params

        teamDb.find({ _id: id })
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'team fetched successfully',
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

        teamTypesDb.find({status : status, typeName: { $regex: '.*' + search + '.*'}})
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
            typeName: payload.typeName,
            description: payload.description,
            userId: 1,
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
            typeName: payload.typeName,
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
    })

}