const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");

// Web Socket
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);//can't ignore app also as we cant just depend on raw http server because Express handles requests and responses raw http server just tells hey this is url and this is req now I dont know what to do with it. So we create a raw http server and wrap it around our Express app and then pass it 
const io = new Server(server, {//can't pass app becoz Server class of socket.io package needs raw http server to attach itself with
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
});//Server is a class and new Server() creates a new server named io which is a combo of socket.io server attached with http server 
// And this new server would only allow cross origin resource sharing of itself with the specified frontend url
// Change app.listen to server.listen
const onlineUsers = new Map();
io.on("connection", (socket) => {//"connection" is a Built-in Socket.IO event. It is Triggered from frontend side automatically when frontend does: const socket = io(...).
    console.log("User connected.");
    socket.on("register", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`Registered ${userId} --> ${socket.id}`)
    });
    socket.on("sendCommentNotification", (data) => {
        if (data.senderId === data.postOwnerId) {
            return;
        }
        const receiverSocket = onlineUsers.get(data.postOwnerId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("receiveCommentNotification", data);
        }
    });
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
    socket.on("joinConversation", (convId) => {//This joinConversation event is triggered from frontend side when user ENTERS specific chat/conversation.
        console.log(`User joined conversation of ${convId}`);
        socket.join(convId);//Generate a room name convId, Add the backend socket object for that client to the conversation having id as convId
    });
    socket.on('sendMessage', (convoId, msg) => {
        console.log('Message sent.');
        io.to(convoId).emit("receiveMessage", msg);//send the message to the same room you created
    });
    socket.on("joinCommunityConversation", (convId) => {
        console.log(`User joined community conversation of ${convId}`);
        socket.join(convId);
    });
    socket.on("sendCommunityMessage", (convoId, msg) => {
        console.log("Message sent.");
        io.to(convoId).emit("receiveCommunityMessage", msg);
    });
});

require("./connection.js");
require("dotenv").config({ path: "./.env" });

app.use(express.json());//parses incoming request body to json
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));//pass this object to cors middleware

const userRoutes = require("./routes/user.js");
const postRoutes = require('./routes/post.js');
const notificationRoutes = require('./routes/notification.js');
const commentRoutes = require('./routes/comment.js');
const conversationRoutes = require('./routes/conversation.js');
const messageRoutes = require('./routes/message.js');
const communityRoutes = require('./routes/community.js');

app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/community", communityRoutes);

// Razorpay Instance
const Razorpay = require('razorpay');
module.exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET
});

const PORT = process.env.PORT || 4000;
server.listen(4000, () => {
    console.log(`App listening on port ${PORT}`);
});