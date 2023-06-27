import React, { useState, useEffect, useContext } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../App";
import { Textarea } from "../Textarea";
import css from "./MessageInput.module.css";

type Props = {
  sendMessage: (content: string) => void;
};

export const MessageInput: React.FC<Props> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socket = useContext(SocketContext) as Socket;

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
    const msg = message.trim();
    if (!msg) return;

    sendMessage(msg);
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
      <button
        className={css["send-button"]}
        onClick={sumbitMessage}
        type="submit"
        title="Send"
      >
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
