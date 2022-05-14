const express = require('express');  // initialized express
const app = express();   // function call express 
const path = require('path');

const {Server} = require('socket.io');   // socket server
const { SEND_MESSAGE, RECIEVE_MESSAGE } = require('./src/Actions');
const ACTIONS = require('./src/Actions');

const server = require('http').createServer(app);  // http server created
const io = new Server(server)  // made instance of socket server

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
// app.use((req, res, next) => {
//    res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

const userSocketMap = {};
function getAllConnectedClients(roomId){
    //Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return{
            socketId,
            username: userSocketMap[socketId]
        }
    })
}


io.on('connection', (socket) => {        // when connection will extablish
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });


    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code})
    })
    socket.on(ACTIONS.SYNC_CODE, ({code, socketId}) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE , {code})
    })

   

    socket.on(ACTIONS.SEND_MESSAGE, (data) => {
        socket.to(data.roomId).emit(ACTIONS.RECIEVE_MESSAGE, data)
        
    })
    

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        
        delete userSocketMap[socket.id]
        socket.leave()

    });

    
}) 

const PORT = process.env.PORT || 5000
server.listen(PORT, () =>{
    console.log(`Listining on port ${PORT}`)
})
