const express = require('express');
const cors = require('cors')

const userRoute = require('./src/router/users');
const db = require('./src/model/index');

const app = express();

const PORT = process.env.NODE_PORT || 8000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user',userRoute)

app.get('/',(req,res) => {
    return res.json({
        msg : "server is running successfully"
    });
})

app.listen(PORT,() => {
    console.log(`Server started successfully ${PORT}.`)
})