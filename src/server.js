import { app } from "./app.js";
import { connectDB } from "./config/mongo.js";

import { createServer } from 'http';
import { Server as SocketIOServer } from "socket.io";

import dotenv from 'dotenv';
dotenv.config();

const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;

await connectDB();

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('New socket connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket disconnected : ', socket.id);
    })
})


httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
