import React, { useRef, useEffect } from "react";
import { IMessage, User } from "../../types";
import { ServerMessage } from "../ServerMessage";
import { UserMessage } from "../UserMessage";
import css from "./MessagesList.module.css";

type Props = {
  messages: IMessage[];
};

export const MessagesList: React.FC<Props> = ({ messages }) => {
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
    let pos: "last" | "first" | "single" | "mid" = "mid";
    if (
      index === messages.length - 1 ||
      !fromCommonGroup(msg, messages[index + 1])
    ) {
      pos = "last";
    }
    if (index === 0 || !fromCommonGroup(msg, messages[index - 1])) {
      if (pos === "last") return "single";
      pos = "first";
    }
    return pos;
  }

  return (
    <ul className={css["messages-list"]} ref={listRef}>
      {messages.map((msg, index) =>
        msg.author === "server" ? (
          <ServerMessage message={msg} key={msg.id} />
        ) : (
          <UserMessage pos={getPos(msg, index)} message={msg} key={msg.id} />
        )
      )}
    </ul>
  );
};
