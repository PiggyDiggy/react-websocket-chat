import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import { ServerMessage } from "@/components/ServerMessage";
import { UserMessage } from "@/components/UserMessage";
import type { RootState } from "@/store";
import { IMessage, User } from "@/types";

import css from "./MessagesList.module.css";

const UserMsg = React.memo(UserMessage);

export const MessagesList = () => {
  const messages = useSelector((state: RootState) => state.messages.list);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current as HTMLUListElement;

    const observer = new ResizeObserver(([entry]) => {
      scrollToBottom(entry.target as HTMLUListElement);
    });
    observer.observe(list);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current as HTMLUListElement;
    scrollToBottom(list);
  }, [messages]);

  function scrollToBottom(element: HTMLUListElement) {
    const rect = element.getBoundingClientRect();
    const bottomOffset = document.body.offsetHeight - rect.bottom;
    const scrollMax = element.scrollHeight - rect.height;

    if (scrollMax - element.scrollTop - bottomOffset < 250) {
      element.scrollTo({ top: scrollMax });
    }
  }

  function hasCommonAuthor(msg1: IMessage, msg2: IMessage) {
    return (msg1.author as User).id === (msg2.author as User).id;
  }

  function fromCommonGroup(msg1: IMessage, msg2: IMessage) {
    return hasCommonAuthor(msg1, msg2) && Math.abs(Date.parse(msg1.date!) - Date.parse(msg2.date!)) / 1000 < 120;
  }

  function getPos(msg: IMessage, index: number) {
    return index === 0 || !fromCommonGroup(msg, messages[index - 1]) ? "first" : "mid";
  }

  return (
    <ul className={css["messages-list"]} ref={listRef}>
      {messages.map((msg, index) =>
        msg.author === "server" ? (
          <ServerMessage message={msg} key={msg.id} />
        ) : (
          <UserMsg pos={getPos(msg, index)} message={msg} key={msg.id} />
        )
      )}
    </ul>
  );
};
