import React, { useContext } from "react";
import { MessageInput } from "../../components/MessageInput";
import { ReplyContainer } from "../../components/ReplyContainer";
import { IMessage, IUserMessage } from "../../types";
import { SocketContext, UserContext } from "../../App";
import css from "./Composer.module.css";

type Props = {
  reply: IUserMessage | null;
  setReply: (msg: IUserMessage | null) => void;
};

export const Composer: React.FC<Props> = ({ reply, setReply }) => {  
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  function sendMessage(content: string) {
    if (!socket || !user) return;

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
