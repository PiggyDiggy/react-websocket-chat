import React, { useContext } from "react";
import { IUserMessage } from "../../types";
import { SocketContext } from "../../App";
import { Avatar } from "../Avatar";
import { cx, formatDate } from "../../utils";
import css from "./UserMessage.module.css";

type Props = {
  message: IUserMessage;
};

export const UserMessage: React.FC<Props> = ({ message }) => {
  const socket = useContext(SocketContext);

  return (
    <li
      className={cx(css["message-wrapper"], {
        [css["message--self"]]: message.author.id === socket?.id,
      })}
    >
      <Avatar name={message.author.name} />
      <div className={css.message}>
        <div className={css.message__info}>
          <div className={css["message__author-name"]}>
            {message.author.name}
          </div>
          <div
            title={formatDate({ date: message.date!, format: "long" })}
            className={css.message__date}
          >
            {formatDate({ date: message.date!, format: "short" })}
          </div>
        </div>
        <div>{message.content}</div>
      </div>
    </li>
  );
};
