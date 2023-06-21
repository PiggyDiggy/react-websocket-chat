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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if ((e.target as Element).parentElement === listRef.current && e.detail > 1) {
        e.preventDefault();
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

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
          <UserMsg pos={getPos(msg, index)} message={msg} setReply={setReply} key={msg.id} />
        )
      )}
    </ul>
  );
};
