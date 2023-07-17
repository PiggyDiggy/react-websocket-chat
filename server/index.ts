import * as express from "express";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import * as path from "path";
import * as cors from "cors";

import { UserStore } from "./userStore";
import { Message, ServerMessage, User, ClientToServerEvents, ServerToClientEvents } from "./types";

const app = express();
const buildPath = path.resolve(__dirname + "/../client/build");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.post("/api/user/create", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send({ error: "Invalid username provided" });
  }
  const { sessionId, user } = createUser(username);
  joinChannel(user);
  res.json(sessionId);
});

app.get("/api/session/:sessionId", (req, res) => {
  const user = users.getUserBySessionId(req.params.sessionId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send({ error: "No user found" });
  }
});

app.get("/api/channel/messages", (_, res) => {
  res.json(messages);
});

app.get("/api/channel/members", (_, res) => {
  res.json(users.findAllUsers());
});

app.get("*", (_, res) => {
  res.sendFile(buildPath + "/index.html");
});

const messages: Array<Message> = [];
const users = new UserStore();

io.on("connection", (socket) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const user = users.getUserBySessionId(sessionId);
    if (user) {
      setUserOnline(user);
    }
  }

  socket.on("user:activity", (activity) => onUserActivity(socket, activity));
  socket.on("user:leave-channel", () => leaveChannel(socket));

  socket.on("disconnect", () => onDisconnect(socket));

  socket.on("message", (message) => addMessage(message));
});

function createUser(username: string) {
  const sessionId = randomUUID();
  const userId = randomUUID();
  const user: User = {
    id: userId,
    name: username,
    online: true,
  };

  users.saveUser(sessionId, user);
  return { sessionId, user };
}

function joinChannel(user: User) {
  if (users.getUser(user.id)) return;
  io.emit("channel:new-member", user);
  sendInfoMessage(`User ${user.name} joined the chat`);
}

function setUserOnline(user: User) {
  if (!user.online) {
    user.online = true;
    io.emit("user:connect", user.id);
  }
}

function leaveChannel(socket: Socket) {
  const { sessionId } = socket.handshake.auth;
  const user = users.getUserBySessionId(sessionId);
  if (!user) return;

  io.emit("channel:member-leave", user.id);
  users.removeUser(sessionId);
  sendInfoMessage(`User ${user.name} left the chat`);
}

async function onDisconnect(socket: Socket) {
  const { sessionId } = socket.handshake.auth;
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
