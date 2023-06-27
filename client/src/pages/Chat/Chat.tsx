import React, { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";

import { Header } from "@/features/Header";
import { MessagesList } from "@/features/Messages";
import { pushMessage, replaceMessages } from "@/features/Messages/messagesSlice";
import { setUsers, removeUser, addUser, setUserOnlineStatus } from "@/features/Users/usersSlice";
import { IMessage, ServerData } from "@/types";
import { SocketContext } from "@/App";
import { Composer } from "@/components/Composer";
import { Sidebar } from "@/components/Sidebar";

import css from "./Chat.module.css";

type Props = {
  handleLogout: () => void;
};

const ComposerMemo = React.memo(Composer);

export const Chat: React.FC<Props> = ({ handleLogout }) => {
  const dispatch = useDispatch();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user:connect", (data: ServerData) => {
      dispatch(replaceMessages(data.messages));
      dispatch(setUsers(data.users));
    });
    socket.on("message", (msg: IMessage) => dispatch(pushMessage(msg)));

    socket.on("channel:new-member", (user) => dispatch(addUser(user)));
    socket.on("channel:member-leave", (user) => dispatch(removeUser(user)));

    socket.on("user:connect", (user) => dispatch(setUserOnlineStatus({ id: user.id, online: true })));
    socket.on("user:disconnect", (user) => dispatch(setUserOnlineStatus({ id: user.id, online: false })));

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, dispatch]);

  return (
    <>
      <Header logout={handleLogout} openSidebar={() => setSidebarOpened(true)} />
      <main className={css.chat}>
        <MessagesList />
        <ComposerMemo />
      </main>
      <Sidebar opened={sidebarOpened} closeSidebar={() => setSidebarOpened(false)} />
    </>
  );
};
