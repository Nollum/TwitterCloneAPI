const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const app = express()
const config = require('./config.json')


// Connect to the MongoDB database
const DB_URI = 'mongodb+srv://rm:<password>@cluster0.hogqo.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority'
const DB_PARAMS = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(DB_URI, DB_PARAMS).then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.log(`Database connection error: ${err}`)
})

// Set up middleware 
app.use(express.json()) // Parse JSON requests
app.use(cookieParser()) 

const router = require('./routes/router')

// Prefix all routes with /api
app.use('/api', router)

app.listen(config.PORT, () => {
    console.log(`App listening on port ${config.PORT}`)
})

// Export the express app for use in tests
module.exports = app



