const app = require("express")();
const server = require("http").createServer(app);
const cors = require('cors');
app.use(cors());
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
io.on('connection', socket => {
    socket.join('room1');
    console.log(`${socket.id} connected`);

    // get total number of connections
    const participantCount = io.engine.clientsCount
    // send event only to connecting User
    socket.emit('admin-message', 'Hi there, new friend!')
    // send event to all others Users 
    socket.broadcast.emit('admin-message', `A new friend has arrived!`)
    // send event to all Users
    io.emit('admin-message', `There is ${participantCount} x friend here now!`)


    // *************************************************************************************
    // HANDLE MESSAGES
    socket.on('new-message', ({ username, message }) => {
        io.in("room1").emit('incoming-message', { username, message });
    })

    // *************************************************************************************
    // HANDLE USER ENTERS ROOM

    socket.on('request-join-game', ({gameId, username}) => { // needs gameId from client
        console.log(`${username} joining ${gameId}`)

        socket.join(gameId) // add User to room (creates new room if no matching room ID)
        // send event to all other Users in specific room
        socket.broadcast.to(gameId).emit('add-user', { username })

        // gather updated room data
        const roomData = io.sockets.adapter.rooms[gameId]
        const inRoomCount = roomData.length
        const inRoomIds = Object.keys(roomData.sockets)

        // send event only to User
        socket.emit('entry-permission', { gameId, players: inRoomIds})
        // send event to all other Users in specific room
        socket.to(gameId).emit('new-player-joining', { username, gameId })
        // send event to all Users in specific room
        io.in(gameId).emit('admin-message', `${inRoomCount} players now in ${gameId}!`)
    })

    // *************************************************************************************
    // HANDLE USER GAME ACTION
    // ('answer-question', currentQuestion, success, username, current.gameId )
    socket.on('answer-question', ({question, success, username, gameId}) => {
        const message = `${username} answered "${question.text}" ${success ? 'correctly!' : 'incorrectly :('}`
        console.log(message)
        socket.broadcast.to(gameId).emit('remote-question-answered', { question, message })
    })

    socket.on('user-completed', ({ username, gameId, points }) => {
        socket.broadcast.to(gameId).emit('remote-user-completed', { username, points })
    })

    // *************************************************************************************
    // HANDLE USER EXITS ROOM

    socket.on('leave-game', ({username, gameId}) => {
        socket.leave(gameId)
        const roomData = io.sockets.adapter.rooms[gameId]
        const inRoomCount = roomData.length
        io.in(gameId).emit('admin-message', `${username} has left the game! ${inRoomCount} players remain in ${gameId}...`)
    })

    // *************************************************************************************
    // HANDLE USER EXITS APP / DISCONNECTS


    socket.on("disconnect", () => {
        console.log(`${socket.id} ${socket.handshake.address} disconnected`);
        // get total number of connections
        const newParticipantCount = io.engine.clientsCount
        // send event to all others Users 
        socket.broadcast.emit('admin-message', `A friend has left!`)
        // send event to all Users
        io.emit('admin-message', `There is ${newParticipantCount} x friend here now!`)
    });
});

module.exports = server