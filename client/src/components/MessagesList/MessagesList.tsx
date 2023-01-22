import React from "react";
import { IMessage } from "../../types";
import { ServerMessage } from "../ServerMessage";
import { UserMessage } from "../UserMessage";
import css from "./MessagesList.module.css";

type Props = {
  messages: IMessage[];
};

export const MessagesList: React.FC<Props> = ({ messages }) => {
  return (
    <ul className={css["messages-list"]}>
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
