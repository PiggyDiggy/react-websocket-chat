import React, { useRef, useEffect } from "react";
import { IMessage } from "../../types";
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

  return (
    <ul className={css["messages-list"]} ref={listRef}>
      {messages.map((msg) =>
        msg.author === "server" ? (
          <ServerMessage message={msg} key={msg.id} />
        ) : (
          <UserMessage message={msg} key={msg.id} />
        )
      )}
    </ul>
  );
};
