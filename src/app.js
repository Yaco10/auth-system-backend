const express = require('express')
const{ config } = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

config()

const userRoutes = require('./routes/user.routes')

const app = express()
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/users',userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`El servido ha iniciado en el puerto: ${port} `)
})