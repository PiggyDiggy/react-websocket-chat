import React, { useEffect, useContext, useState } from "react";
import { User, IMessage, ServerData, IUserMessage } from "../../types";
import { SocketContext } from "../../App";
import { MessagesList } from "../../components/MessagesList";
import { Composer } from "../../components/Composer";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import css from "./Chat.module.css";

type Props = {
  handleLogout: () => void;
};

const ComposerMemo = React.memo(Composer);

export const Chat: React.FC<Props> = ({ handleLogout }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [reply, setReply] = useState<IUserMessage | null>(null);
  const socket = useContext(SocketContext);  

  useEffect(() => {
    if (!socket) return;

    socket.emit("user-connect", (data: ServerData) => {
      setMessages(data.messages);
      setUsers(data.users);
    });
    socket.on("message", (msg) => setMessages((list) => [...list, msg]));
    socket.on("user-connect", (users) => setUsers(users));
    socket.on("user-disconnect", (users) => setUsers(users));

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  function getOnlineUsersCount() {
    return users.filter((user) => user.online).length;
  }

  return (
    <>
      <Header
        logout={handleLogout}
        openSidebar={() => setSidebarOpened(true)}
        usersCount={getOnlineUsersCount()}
      />
      <main className={css.chat}>
        <MessagesList setReply={setReply} messages={messages} />
        <ComposerMemo reply={reply} setReply={setReply} />
      </main>
      <Sidebar
        users={users}
        opened={sidebarOpened}
        closeSidebar={() => setSidebarOpened(false)}
      />
    </>
  );
};
