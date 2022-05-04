"use strict";var _socketio = require('socket.io');
var _directservice = require('./services/Social/direct.service');
const io = new (0, _socketio.Server)({ cors: "*" });

io.on("connection", (socket) => {
    socket.on("wg_join", (room) => {
        socket.join(room);
    });

    socket.on("wg_newmessage", async (data) => {
        const newMessage = await _directservice.DirectService.createNewmessage({
            id: data.id,
            author: data.author,
            message: data.message,
            room: data.room,
        });
        io.to(data.room).emit("wg_callback", newMessage);
    });
});

io.listen(
    process.env.WEBSOCKET_PORT,
    console.log("wg:web_socket ➜ listen on *" + process.env.WEBSOCKET_PORT)
);
