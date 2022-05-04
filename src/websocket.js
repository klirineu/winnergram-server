import { Server } from "socket.io";
import { DirectService } from "./services/Social/direct.service";
const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
    socket.on("wg_join", (room) => {
        socket.join(room);
    });

    socket.on("wg_newmessage", async (data) => {
        const newMessage = await DirectService.createNewmessage({
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
