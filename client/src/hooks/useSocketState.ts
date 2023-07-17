import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { io, type Socket } from "socket.io-client";

import type { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { pushMessage } from "@/features/Messages/messagesSlice";
import { removeUser, addUser, setUserOnlineStatus } from "@/features/Users/usersSlice";

export type SocketWithEvents = Socket<ServerToClientEvents, ClientToServerEvents>;

const address = process.env.NODE_ENV === "development" ? "//:8080" : "";

export const useSocketState = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<SocketWithEvents | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("chat-session-id");
    const socket = io(address, { auth: { sessionId } });
    setSocket(socket);

    socket.on("message", (msg) => dispatch(pushMessage(msg)));

    socket.on("channel:new-member", (user) => dispatch(addUser(user)));
    socket.on("channel:member-leave", (id) => dispatch(removeUser(id)));

    socket.on("user:connect", (id) => dispatch(setUserOnlineStatus({ id, online: true })));
    socket.on("user:disconnect", (id) => dispatch(setUserOnlineStatus({ id, online: false })));

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return socket;
};
