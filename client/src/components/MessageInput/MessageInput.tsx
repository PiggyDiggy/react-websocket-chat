import React, { useState } from "react";

type Props = {
  sendMessage: (content: string) => void;
};

export const MessageInput: React.FC<Props> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  function onClick() {
    if (!message) return;

    sendMessage(message);
  }

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={message}
          autoComplete="off"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={onClick} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
