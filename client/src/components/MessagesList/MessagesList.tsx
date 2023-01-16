import React from "react";
import { IMessage, User } from "../../types";
import { Message } from "../Message/Message";

type Props = {
  messages: IMessage[];
  user: User;
};

export const MessagesList: React.FC<Props> = ({ messages, user }) => {
  return (
    <ul>
      {messages.map((msg) => (
        <Message message={msg} key={msg.id} />
      ))}
    </ul>
  );
};
