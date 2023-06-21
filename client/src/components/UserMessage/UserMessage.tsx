import React, { useContext } from "react";
import { IUserMessage, User } from "../../types";
import { UserContext } from "../../App";
import { Avatar } from "../Avatar";
import { ReplyPreview } from "../ReplyPreview";
import { MessageInfo } from "../MessageInfo";
import { cx } from "../../utils";
import css from "./UserMessage.module.css";

type Props = {
  message: IUserMessage;
  pos: "first" | "mid";
  setReply: (msg: IUserMessage) => void;
};

export const UserMessage: React.FC<Props> = ({ message, pos, setReply }) => {
  const user = useContext(UserContext) as User;
  const isOwn = message.author.id === user.id;

  if (pos === "first") {
    return (
      <li
        className={cx(css["message-wrapper"], css["first-in-group"], {
          [css.self]: isOwn,
        })}
        onDoubleClick={() => setReply(message)}
      >
        <div className={css.message}>
          <Avatar name={message.author.name} />
          <div className={css.message__container}>
            <div className={css.message__content}>
              <MessageInfo date={message.date!} author={message.author.name} />
              {message.reply && <ReplyPreview message={message.reply} className={css.message__reply} />}
              <div>{message.content}</div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={cx(css["message-wrapper"], { [css.self]: isOwn })} onDoubleClick={() => setReply(message)}>
      <div className={css.message}>
        <div className={css.message__container}>
          {message.reply && <ReplyPreview message={message.reply} />}
          <div className={css.message__content}>
            {message.content}
            <MessageInfo date={message.date!} />
          </div>
        </div>
      </div>
    </li>
  );
};
