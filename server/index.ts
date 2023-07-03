import * as express from "express";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { UserStore } from "./userStore";
import { Message, ServerMessage, User, ClientToServerEvents, ServerToClientEvents, ChannelData } from "./types";
import path = require("path");

const app = express();
const buildPath = path.resolve(__dirname + "/../client/build");

app.use(express.static(buildPath));

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
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
    const user = users.getUserBySessionId(sessionId);
    if (user) {
      setUserOnline(socket, user);
      loginUser(socket, user);
    }
  }

  next();
});

io.on("connection", (socket) => {
  socket.on("user:activity", (activity) => onUserActivity(socket, activity));
  socket.on("user:join-channel", (username) => joinChannel(socket, username));
  socket.on("user:leave-channel", () => leaveChannel(socket));

  socket.on("channel:get-data", (cb) => sendChannelInfo(cb));

  socket.on("disconnect", () => onDisconnect(socket));

  socket.on("message", (message) => addMessage(message));
});

function createUser(socket: Socket, username: string) {
  const sessionId = randomUUID();
  const userId = randomUUID();
  const user: User = {
    id: userId,
    name: username,
    online: true,
  };

  users.saveUser(sessionId, user);
  socket.handshake.auth.sessionId = sessionId;
  return user;
}

function joinChannel(socket: Socket, username: string) {
  if (users.getUserBySessionId(socket.handshake.auth.sessionId)) return;

  const user = createUser(socket, username);
  loginUser(socket, user);
  socket.broadcast.emit("channel:new-member", user);
  sendInfoMessage(`User ${user.name} joined the chat`);
}

function loginUser(socket: Socket, user: User) {
  const { sessionId } = socket.handshake.auth;

  socket.emit("session", {
    sessionId,
    user,
  });
}

function setUserOnline(socket: Socket, user: User) {
  if (!user.online) {
    user.online = true;
    socket.broadcast.emit("user:connect", user.id);
  }
}

function sendChannelInfo(cb: (data: ChannelData) => void) {
  cb({ messages, users: users.findAllUsers() });
}

async function leaveChannel(socket: Socket) {
  const { sessionId } = socket.handshake.auth;
  const user = users.getUserBySessionId(sessionId);

  io.emit("channel:member-leave", user.id);
  users.removeUser(sessionId);
  sendInfoMessage(`User ${user.name} left the chat`);
}

async function onDisconnect(socket: Socket) {
  const { sessionId } = socket.handshake.auth;
  if (!sessionId) return;

  const matchingSockets = await getSessionSockets(sessionId);
  if (matchingSockets.length === 0) {
    const user = users.getUserBySessionId(sessionId);
    if (!user) return;
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
  const user = users.getUserBySessionId(socket.handshake.auth.sessionId);
  if (activity === "idle") {
    users.removeTypingUser(user);
  } else if (activity === "typing") {
    users.addTypingUser(user);
  }

  socket.broadcast.emit("user:activity", users.getTypingUsers());
}

function sendInfoMessage(content: string) {
  const message: Omit<ServerMessage, "id"> = {
    author: "server",
    type: "info",
    content,
  };
  addMessage(message);
}

function addMessage(message: Omit<Message, "id">) {
  const msg = buildMessage(message);
  messages.push(msg);
  io.emit("message", msg);
}

function buildMessage(message: Omit<Message, "id">) {
  return {
    ...message,
    date: new Date().toJSON(),
    id: messages.length,
  } as Message;
}
