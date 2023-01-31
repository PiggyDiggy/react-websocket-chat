import React, { useEffect, useContext, useState } from "react";
import { User, IMessage, ServerData } from "../../types";
import { SocketContext } from "../../App";
import { MessagesList } from "../../components/MessagesList";
import { MessageInput } from "../../components/MessageInput";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import css from "./Chat.module.css";

type Props = {
  user: User;
  handleLogout: () => void;
};

export const Chat: React.FC<Props> = ({ user, handleLogout }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<ServerData["users"]>({});
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user-connect", user, (data: ServerData) => {
      setMessages(data.messages);
      setUsers(data.users);
    });
    socket.on("message", (msg) => setMessages((list) => [...list, msg]));
    socket.on("user-connect", (users) => setUsers(users));
    socket.on("user-disconnect", (users) => setUsers(users));

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, user]);

  function sendMessage(content: string) {
    if (!socket) return;

    const msg: IMessage = {
      type: "msg",
      author: user,
      content,
    };
    socket.emit("message", msg);
  }

  return (
    <>
      <Header
        logout={handleLogout}
        openSidebar={() => setSidebarOpened(true)}
      />
      <main className={css.chat}>
        <MessagesList messages={messages} />
        <MessageInput sendMessage={sendMessage} />
      </main>
      <Sidebar
        users={Object.values(users)}
        opened={sidebarOpened}
        closeSidebar={() => setSidebarOpened(false)}
      />
    </>
  );
};
