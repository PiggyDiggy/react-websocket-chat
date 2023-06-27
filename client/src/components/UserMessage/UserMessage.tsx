import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "@/store";
import { setReply } from "@/features/Reply/replySlice";
import { IUserMessage, User } from "@/types";
import { cx } from "@/utils";

import { Avatar } from "../Avatar";
import { ReplyPreview } from "../ReplyPreview";
import { MessageInfo } from "../MessageInfo";

import css from "./UserMessage.module.css";

type Props = {
  message: IUserMessage;
  pos: "first" | "mid";
};

export const UserMessage: React.FC<Props> = ({ message, pos }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.self.user) as User;
  const messageRef = useRef<HTMLLIElement>(null);

  const isOwn = message.author.id === user.id;

  useEffect(() => {
    const messageElement = messageRef.current as HTMLLIElement;

    function handleClick(e: MouseEvent) {
      if (e.detail > 1 && e.target === messageRef.current) {
        e.preventDefault();
        dispatch(setReply(message));
      }
    }

    messageElement.addEventListener("mousedown", handleClick);

    return () => {
      messageElement.removeEventListener("mousedown", handleClick);
    };
  }, [dispatch, message]);

  if (pos === "first") {
    return (
      <li
        className={cx(css["message-wrapper"], css["first-in-group"], {
          [css.self]: isOwn,
        })}
        ref={messageRef}
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
    <li className={cx(css["message-wrapper"], { [css.self]: isOwn })} ref={messageRef}>
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
