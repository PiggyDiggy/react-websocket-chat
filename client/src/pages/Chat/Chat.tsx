import React, { useEffect, useContext, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Header } from "@/features/Header";
import { MessagesList } from "@/features/Messages";
import { pushMessage, replaceMessages } from "@/features/Messages/messagesSlice";
import { setUsers, removeUser, addUser, setUserOnlineStatus } from "@/features/Users/usersSlice";
import { SocketContext } from "@/App";
import { Composer } from "@/components/Composer";
import { Sidebar } from "@/components/Sidebar";

import css from "./Chat.module.css";

const ComposerMemo = React.memo(Composer);

export const Chat = () => {
  const dispatch = useDispatch();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const socket = useContext(SocketContext);

  const openSidebar = useCallback(() => {
    setSidebarOpened(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpened(false);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("channel:get-data", (data) => {
      dispatch(replaceMessages(data.messages));
      dispatch(setUsers(data.users));
    });
    socket.on("message", (msg) => dispatch(pushMessage(msg)));

    socket.on("channel:new-member", (user) => dispatch(addUser(user)));
    socket.on("channel:member-leave", (id) => dispatch(removeUser(id)));

    socket.on("user:connect", (id) => dispatch(setUserOnlineStatus({ id, online: true })));
    socket.on("user:disconnect", (id) => dispatch(setUserOnlineStatus({ id, online: false })));

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, dispatch]);

  return (
    <>
      <Header openSidebar={openSidebar} />
      <main className={css.chat}>
        <MessagesList />
        <ComposerMemo />
      </main>
      <Sidebar opened={sidebarOpened} closeSidebar={closeSidebar} />
    </>
  );
};
