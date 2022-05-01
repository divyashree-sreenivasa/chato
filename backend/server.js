const express = require('express')
const dotenv = require('dotenv').config()
const chat = require('../data/data')
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path');

const { resourceNotFoundError, errorHandler } = require('./middlewares/errorMiddleware')

const port = process.env.PORT || 5000


const app = express()

connectDB()

app.use(express.json())

// app.get('/api/chat', (req, res) => {
//     res.send(chat)
// })

// app.get('/api/chat/:id', (req, res) => {
//     const requestedChat = chat.find((c) => c._id === req.params.id)
//     res.send(requestedChat)
// })

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.use(resourceNotFoundError)
app.use(errorHandler)

const server = app.listen(port, () => console.log(`Server started on port ${port}`.yellow.bold))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on("connection", (socket) => {
    console.log(`connected to socket.io`.bgMagenta);

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessage) => {
        let chat = newMessage.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if(user._id == newMessage.sender._id) return;

            socket.in(user._id).emit("message received", newMessage);
        })
    })

    socket.off("setup", () => {
        console.log("User disconnected".bgCyan);
        socket.leave(userData._id);
    })
})