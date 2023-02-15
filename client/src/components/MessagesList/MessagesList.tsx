import React, { useRef, useEffect } from "react";
import { IMessage, IUserMessage, User } from "../../types";
import { ServerMessage } from "../ServerMessage";
import { UserMessage } from "../UserMessage";
import css from "./MessagesList.module.css";

type Props = {
  messages: IMessage[];
  setReply: (msg: IUserMessage) => void;
};

const UserMsg = React.memo(UserMessage);

export const MessagesList: React.FC<Props> = ({ messages, setReply }) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current as HTMLUListElement;

    const observer = new ResizeObserver(([entry]) => {
      entry.target.scrollTop = entry.target.scrollHeight;
    });
    observer.observe(list);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current as HTMLUListElement;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function hasCommonAuthor(msg1: IMessage, msg2: IMessage) {
    return (msg1.author as User).id === (msg2.author as User).id;
  }

  function fromCommonGroup(msg1: IMessage, msg2: IMessage) {
    return (
      hasCommonAuthor(msg1, msg2) &&
      Math.abs(Date.parse(msg1.date!) - Date.parse(msg2.date!)) / 1000 < 120
    );
  }

  function getPos(msg: IMessage, index: number) {
    return index === 0 || !fromCommonGroup(msg, messages[index - 1])
      ? "first"
      : "mid";
  }

  return (
    <ul className={css["messages-list"]} ref={listRef}>
      {messages.map((msg, index) =>
        msg.author === "server" ? (
          <ServerMessage message={msg} key={msg.id} />
        ) : (
          <UserMsg
            pos={getPos(msg, index)}
            message={msg}
            setReply={setReply}
            key={msg.id}
          />
        )
      )}
    </ul>
  );
};
