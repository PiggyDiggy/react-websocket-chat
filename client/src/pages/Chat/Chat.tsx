import React, { useEffect, useContext, useState } from "react";
import { User, IMessage } from "../../types";
import { SocketContext } from "../../App";
import { MessagesList } from "../../components/MessagesList";
import { MessageInput } from "../../components/MessageInput";
import css from "./Chat.module.css";

type Props = {
  user: User;
  handleLogout: () => void;
};

export const Chat: React.FC<Props> = ({ user, handleLogout }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user-connect", user, (data: IMessage[]) => {
      setMessages(data);
    });
    socket.on("message", (msg) => setMessages((list) => [...list, msg]));

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
    <section className={css.chat}>
      <MessagesList messages={messages} />
      <MessageInput sendMessage={sendMessage} />
      <button className={css["leave-button"]} onClick={handleLogout}>Leave Chat</button>
    </section>
  );
};
