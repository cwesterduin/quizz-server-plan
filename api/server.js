const express = require("express")
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const server = require("http").createServer(app);
const gamesController = require("./controllers/games")
app.use('/games', gamesController)


const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
io.on('connection', socket => {

    socket.on('create', (roomId) => {
        console.log('created room', roomId)
        socket.join(roomId);
        io.to(roomId).emit('admin-message', `${socket.id} has joined`)
        io.to(roomId).emit('count', io.sockets.adapter.rooms.get(roomId) ? io.sockets.adapter.rooms.get(roomId).size : 0)
        socket.on('new-message', ({ username, message }) => {
            io.in(roomId).emit('incoming-message', { username, message });
        })
    // *************************************************************************************
    // HANDLE USER ENTERS ROOM
    socket.on("disconnect", () => {
        io.to(roomId).emit('count', io.sockets.adapter.rooms.get(roomId) ? io.sockets.adapter.rooms.get(roomId).size : 0)
        io.to(roomId).emit('admin-message', `${socket.id} has left`)
    });

})


});

module.exports = server