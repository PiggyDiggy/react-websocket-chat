import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "@/store";
import { MessageInput } from "@/components/MessageInput";
import { IUserMessage } from "@/types";
import { SocketContext, UserContext } from "@/App";

import { ReplyContainer } from "../../features/Reply";
import { setReply } from "../../features/Reply/replySlice";

import css from "./Composer.module.css";

export const Composer = () => {
  const dispatch = useDispatch();
  const reply = useSelector((state: RootState) => state.reply.message);
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  function sendMessage(content: string) {
    if (!socket || !user) return;

    const msg: Omit<IUserMessage, "id"> = {
      type: "msg",
      author: user,
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
