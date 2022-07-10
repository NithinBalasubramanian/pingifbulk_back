const express = require('express');

const userRoute = express();

userRoute.get('/',(req,res) => {
    return res.json({
        msg : "user router successfully"
    })
})

module.exports = userRoute