import React, { useContext } from "react";
import { MessageInput } from "../../components/MessageInput";
import { ReplyContainer } from "../../components/ReplyContainer";
import { IMessage, IUserMessage, User } from "../../types";
import { SocketContext } from "../../App";
import css from "./Composer.module.css";

type Props = {
  user: User;
  reply: IUserMessage | null;
  setReply: (msg: IUserMessage | null) => void;
};

export const Composer: React.FC<Props> = ({ user, reply, setReply }) => {  
  const socket = useContext(SocketContext);

  function sendMessage(content: string) {
    if (!socket) return;

    const msg: IMessage = {
      type: "msg",
      author: user,
      content,
    };

    if (reply) {
      msg.reply = reply;
    }

    socket.emit("message", msg);
    setReply(null);
  }

  return (
    <div className={css.composer}>
      <ReplyContainer message={reply} setReply={setReply} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};
