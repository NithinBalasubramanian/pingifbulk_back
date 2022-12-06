const mongoose = require('mongoose')
require('../model/consumer')
require('../model/consumerType')
const consumerDb = mongoose.model('consumer')
const consumerTypeDb = mongoose.model('consumerType')

module.exports = {
    consumerService: ((req,res) => {
        return res.json({
            msg: 'Common service working fine'
        })
    }),

    // Add consumers
    consumerAdd: ((req,res) => {
        return res.json({
            msg: 'Common service working fine'
        })
    }),

    // Update consumers
    consumerUpdate: ((req,res) => {
        return res.json({
            msg: 'Common service working fine'
        })
    }),

    // Change status
    consumerStatusUpdate: ((req,res) => {
        return res.json({
            msg: 'Common service working fine'
        })
    }),

    // list consumers based on logged user
    listConsumers: ((req,res) => {
        const { search, status, type } =  req.query

        consumerDb.find({"firstName": { $regex: '.*' + search + '.*', $options: 'i' }, status: status}).sort({ createdOn: -1})
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Consumers fetched successfully',
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
    listConsumer: ((req,res) => {
        const { id } =  req.params

        consumerDb.find({ _id: id })
            .then(resData => {
                return res.json({
                    data: resData,
                    msg: 'Consumer fetched successfully',
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

    // reference list all consumer type
    listConsumerType: ((req,res) => {
        const { search, status } =  req.query

        consumerTypeDb.find({status : status, typeName: { $regex: '.*' + search + '.*'}})
            .then(resData => {
                return res.json({
                    msg: 'Consumer Type fetched successfully',
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