const express = require('express')
const app = express()
const UserRoutes = require('./routes/userRoutes')

const conn = require('./db/conn')

app.use(express.json())

app.use('/users',UserRoutes)

app.listen(3000)