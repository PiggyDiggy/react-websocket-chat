import React from "react";
import { IUserMessage } from "../../types";
import { cx } from "../../utils";
import css from "./ReplyPreview.module.css";

type Props = {
  message: IUserMessage;
  className?: string;
};

export const ReplyPreview: React.FC<Props> = ({ message, className }) => {
  return (
    <div className={cx(css.reply, className)}>
      <div className={css.reply__message}>
        <div className={css.message__author}>{message.author.name}</div>
        <div className={css.message__content}>{message.content}</div>
      </div>
    </div>
  );
};
