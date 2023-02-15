import React, { useState } from "react";
import { Textarea } from "../Textarea";
import css from "./MessageInput.module.css";

type Props = {
  sendMessage: (content: string) => void;
};

export const MessageInput: React.FC<Props> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  function sumbitMessage() {
    if (!message.trim()) return;

    sendMessage(message.trim());
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
