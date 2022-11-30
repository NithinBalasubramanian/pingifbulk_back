const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const Router = require('./src/router');
const db = require('./src/model/index');

const app = express();

const PORT = process.env.NODE_PORT || 8000;

app.use(cors())
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// User Management
app.use('/v1/user',Router.UserRouter)

// Mailer management
app.use('/v1/mailer',Router.MailerRouter)

app.get('/',(req,res) => {
    return res.json({
        msg : "server is running successfully"
    });
})

app.listen(PORT,() => {
    console.log(`Server started successfully ${PORT}.`)
})