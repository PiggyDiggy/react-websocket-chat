import React from "react";
import { IMessage } from "../../types";

type Props = {
  message: IMessage;
};

export const Message: React.FC<Props> = ({ message }) => {
  return (
    <>
      {message.author === "server" ? (
        <li>{message.content}</li>
      ) : (
        <li>
          {message.author.name} - {message.content}
        </li>
      )}
    </>
  );
};
