const express = require('express')
const app = express()
const UserRoutes = require('./routes/userRoutes')
require('dotenv').config()


const conn = require('./db/conn')

app.use(express.json())
app.use(express.static('uploads'))

app.use('/users',UserRoutes)

app.listen(3000)