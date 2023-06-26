import React, { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";

import { MessagesList } from "@/features/Messages";
import { pushMessage, replaceMessages } from "@/features/Messages/messagesSlice";

import { User, IMessage, ServerData } from "../../types";
import { SocketContext } from "../../App";
import { Composer } from "../../components/Composer";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";

import css from "./Chat.module.css";

type Props = {
  handleLogout: () => void;
};

const ComposerMemo = React.memo(Composer);

export const Chat: React.FC<Props> = ({ handleLogout }) => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user-connect", (data: ServerData) => {
      dispatch(replaceMessages(data.messages));
      setUsers(data.users);
    });
    socket.on("message", (msg: IMessage) => dispatch(pushMessage(msg)));
    socket.on("user-connect", (users) => setUsers(users));
    socket.on("user-disconnect", (users) => setUsers(users));

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, dispatch]);

  function getOnlineUsersCount() {
    return users.filter((user) => user.online).length;
  }

  return (
    <>
      <Header logout={handleLogout} openSidebar={() => setSidebarOpened(true)} usersCount={getOnlineUsersCount()} />
      <main className={css.chat}>
        <MessagesList />
        <ComposerMemo />
      </main>
      <Sidebar users={users} opened={sidebarOpened} closeSidebar={() => setSidebarOpened(false)} />
    </>
  );
};
