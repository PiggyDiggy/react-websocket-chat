import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Socket } from "socket.io-client";

import { SocketContext } from "@/App";
import type { RootState } from "@/store";
import { IUserMessage, User } from "@/types";
import { setReply } from "@/features/Reply/replySlice";

import { Textarea } from "../Textarea";

import css from "./MessageInput.module.css";

export const MessageInput = () => {
  const dispatch = useDispatch();
  const reply = useSelector((state: RootState) => state.reply.message);
  const user = useSelector((state: RootState) => state.self.user) as User;

  const socket = useContext(SocketContext) as Socket;

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  useEffect(() => {
    socket.emit("user:activity", isTyping ? "typing" : "idle");
  }, [isTyping, socket]);

  function sumbitMessage() {
    const content = message.trim();
    if (!content) return;

    const msg: Omit<IUserMessage, "id"> = {
      type: "msg",
      author: { id: user.id, name: user.name },
      content,
    };

    if (reply) {
      msg.reply = reply;
      dispatch(setReply(null));
    }

    socket.emit("message", msg);
    setMessage("");
  }

  return (
    <form className={css.input__form} onSubmit={(e) => e.preventDefault()}>
      <div className={css["form__textarea-wrapper"]}>
        <Textarea
          placeholder="Type Message..."
          value={message}
          setValue={setMessage}
          submit={sumbitMessage}
          className={css["message-textarea"]}
        />
      </div>
      <button className={css["send-button"]} onClick={sumbitMessage} type="submit" title="Send">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#575757"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};
