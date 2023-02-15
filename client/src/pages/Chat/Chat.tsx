import React, { useEffect, useContext, useState } from "react";
import { User, IMessage, ServerData, IUserMessage } from "../../types";
import { SocketContext } from "../../App";
import { MessagesList } from "../../components/MessagesList";
import { Composer } from "../../components/Composer";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import css from "./Chat.module.css";

type Props = {
  user: User;
  handleLogout: () => void;
};

const ComposerMemo = React.memo(Composer);

export const Chat: React.FC<Props> = ({ user, handleLogout }) => {  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<ServerData["users"]>({});
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [reply, setReply] = useState<IUserMessage | null>(null);
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

  function getOnlineUsersCount() {
    return Object.values(users).reduce((count, user) => {
      return user.online ? count + 1 : count;
    }, 0);
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
        <ComposerMemo reply={reply} setReply={setReply} user={user} />
      </main>
      <Sidebar
        users={Object.values(users)}
        opened={sidebarOpened}
        closeSidebar={() => setSidebarOpened(false)}
      />
    </>
  );
};
