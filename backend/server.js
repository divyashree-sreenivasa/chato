const express = require('express')
const dotenv = require('dotenv').config()
const chat = require('../data/data')
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')

const { resourceNotFoundError, errorHandler } = require('./middlewares/errorMiddleware')

const port = process.env.PORT || 5000


const app = express()

connectDB()

app.use(express.json())


app.get('/', (req, res) => {
    res.send("Api is running")
})

// app.get('/api/chat', (req, res) => {
//     res.send(chat)
// })

// app.get('/api/chat/:id', (req, res) => {
//     const requestedChat = chat.find((c) => c._id === req.params.id)
//     res.send(requestedChat)
// })

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

app.use(resourceNotFoundError)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`.yellow.bold))