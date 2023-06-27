import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "@/store";
import { MessageInput } from "@/components/MessageInput";
import { IUserMessage } from "@/types";
import { SocketContext } from "@/App";

import { ReplyContainer } from "../../features/Reply";
import { setReply } from "../../features/Reply/replySlice";

import css from "./Composer.module.css";

export const Composer = () => {
  const dispatch = useDispatch();
  const reply = useSelector((state: RootState) => state.reply.message);
  const user = useSelector((state: RootState) => state.self.user);
  const socket = useContext(SocketContext);

  function sendMessage(content: string) {
    if (!socket || !user) return;

    const msg: Omit<IUserMessage, "id"> = {
      type: "msg",
      author: { id: user.id, name: user.name },
      content,
    };

    if (reply) {
      msg.reply = reply;
    }

    socket.emit("message", msg);
    dispatch(setReply(null));
  }

  return (
    <div className={css.composer}>
      <ReplyContainer />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};
