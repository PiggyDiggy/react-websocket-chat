import * as express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Message, User, Data } from "./types";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const messages: Array<Message> = [];
const users: Record<string, User> = {};

io.on("connection", (socket) => {
  socket.on("user-connect", (user, cb) => onUserConnect(socket, user, cb));
  socket.on("disconnect", () => onUserDisconnect(socket));
  socket.on("user-disconnect", () => onUserDisconnect(socket));
  socket.on("message", (message) => addMessage(message));
});

function onUserConnect(
  socket: Socket,
  user: User,
  callback: (data: Data) => void
) {  
  users[user.id] = user;
  sendInfoMessage(`User ${user.name} joined the chat`);
  callback({ messages, users });
  socket.broadcast.emit("user-connect", users);
}

function onUserDisconnect(socket: Socket) {
  const user = users[socket.id];
  if (!user) return;
  user.online = false;
  sendInfoMessage(`User ${user.name} left the chat`);
  socket.broadcast.emit("user-disconnect", users);
}

function sendInfoMessage(content: string) {
  const message: Message = {
    author: "server",
    type: "info",
    content,
  };
  addMessage(message);
}

function addMessage(message: Message) {
  const msg = buildMessage(message);
  messages.push(msg);
  io.emit("message", msg);
}

function buildMessage(message: Message) {
  return {
    ...message,
    date: new Date().toString(),
    id: messages.length,
  };
}
