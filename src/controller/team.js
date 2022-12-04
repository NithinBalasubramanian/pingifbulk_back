const mongoose = require('mongoose')
const teamDb = mongoose.model('team')

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
    })
}