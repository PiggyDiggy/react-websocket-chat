import React, { useContext } from "react";
import { IUserMessage } from "../../types";
import { SocketContext } from "../../App";
import { Avatar } from "../Avatar";
import { cx, formatDate } from "../../utils";
import css from "./UserMessage.module.css";

type Props = {
  message: IUserMessage;
  pos: "first" | "last" | "mid" | "single";
};

export const UserMessage: React.FC<Props> = ({ message, pos }) => {
  const socket = useContext(SocketContext);

  return (
    <li
      className={cx(css["message-wrapper"], {
        [css["self"]]: message.author.id === socket?.id,
        [css["last-in-group"]]: pos === "last" || pos === "single",
        [css["first-in-group"]]: pos === "first" || pos === "single",
      })}
    >
      <div className={css.message}>
        {pos === "last" || pos === "single" ? (
          <Avatar name={message.author.name} />
        ) : null}
        <div className={css.message__content}>
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
      </div>
    </li>
  );
};
