import React, { useContext } from "react";
import { IUserMessage } from "../../types";
import { SocketContext } from "../../App";
import { Avatar } from "../Avatar";
import { cx, formatDate } from "../../utils";
import css from "./UserMessage.module.css";

type Props = {
  message: IUserMessage;
  pos: "first" | "mid";
};

export const UserMessage: React.FC<Props> = ({ message, pos }) => {
  const socket = useContext(SocketContext);

  return (
    <>
      {pos === "first" ? (
        <li
          className={cx(css["message-wrapper"], css["first-in-group"], {
            [css["self"]]: message.author.id === socket?.id,
          })}
        >
          <div className={css.message}>
            <Avatar name={message.author.name} />
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
      ) : (
        <li
          className={cx(css["message-wrapper"], {
            [css["self"]]: message.author.id === socket?.id,
          })}
        >
          <div className={css.message}>
            <div className={css.message__content}>
              <div>{message.content}</div>
              <div className={css.message__info}>
                <div
                  title={formatDate({ date: message.date!, format: "long" })}
                  className={css.message__date}
                >
                  {formatDate({ date: message.date!, format: "short" })}
                </div>
              </div>
            </div>
          </div>
        </li>
      )}
    </>
  );
};
