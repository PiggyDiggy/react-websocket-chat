import * as express from "express";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { UserStore } from "./userStore";
import { Message, User, Data } from "./types";
import path = require("path");

const app = express();
const buildPath = path.resolve(__dirname + "/../client/build");

app.use(express.static(buildPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get("*", (_, res) => {
  res.sendFile(buildPath + "/index.html");
});

const messages: Array<Message> = [];
const users = new UserStore();

io.use((socket: Socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const user = users.findUser(sessionId);
    if (user) {
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }

  socket.handshake.auth.sessionId = randomUUID();
  const userId = randomUUID();
  const user: User = {
    id: userId,
    name: username,
    online: false,
  };
  users.saveUser(socket.handshake.auth.sessionId, user);
  socket.broadcast.emit("channel:new-member", user);
  sendInfoMessage(`User ${user.name} joined the chat`);
  next();
});

io.on("connection", (socket) => {
  const { sessionId } = socket.handshake.auth;
  socket.emit("session", {
    sessionId,
    user: users.findUser(sessionId),
  });

  socket.on("user:connect", (cb) => onUserConnect(socket, cb));
  socket.on("disconnect", () => onDisconnect(socket, sessionId));
  socket.on("user:disconnect", () => onUserDisconnect(socket, sessionId));
  socket.on("message", (message) => addMessage(message));
  socket.on("user:activity", (activity) => onUserActivity(socket, activity));
});

function onUserConnect(socket: Socket, callback: (data: Data) => void) {
  const user = users.findUser(socket.handshake.auth.sessionId);
  if (!user.online) {
    user.online = true;
    socket.broadcast.emit("user:connect", user.id);
  }
  callback({ messages, users: users.findAllUsers() });
}

async function onUserDisconnect(socket: Socket, sessionId: string) {
  const matchingSockets = await getSessionSockets(sessionId);
  matchingSockets.forEach((socket) => socket.disconnect());
  const user = users.findUser(sessionId);
  socket.broadcast.emit("channel:member-leave", user.id);
  sendInfoMessage(`User ${user.name} left the chat`);
}

async function onDisconnect(socket: Socket, sessionId: string) {
  const matchingSockets = await getSessionSockets(sessionId);
  if (matchingSockets.length === 0) {
    const user = users.findUser(sessionId);
    user.online = false;
    users.removeTypingUser(user);
    socket.broadcast.emit("user:disconnect", user.id);
  }
}

async function getSessionSockets(sessionId: string) {
  const sockets = await io.fetchSockets();
  return sockets.filter((socket) => socket.handshake.auth.sessionId === sessionId);
}

function onUserActivity(socket: Socket, activity: string) {
  const user = users.findUser(socket.handshake.auth.sessionId);
  if (activity === "idle") {
    users.removeTypingUser(user);
  } else if (activity === "typing") {
    users.addTypingUser(user);
  }

  socket.broadcast.emit("user:activity", users.getTypingUsers());
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
    date: new Date().toJSON(),
    id: messages.length,
  };
}
