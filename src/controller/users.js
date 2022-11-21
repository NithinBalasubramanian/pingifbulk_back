const express = require('express');

const userRoute = express();

userRoute.get('/',(req,res) => {
    return res.json({
        msg : "user router successfully"
    })
})

userRoute.get('/registerUser',(req,res) => {
    return res.json({
        msg : "user register successfully"
    })
})

module.exports = userRoute