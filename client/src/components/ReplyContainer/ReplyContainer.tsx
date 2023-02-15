import React from "react";
import { IUserMessage } from "../../types";
import { ReplyPreview } from "../ReplyPreview";
import css from "./ReplyContainer.module.css";

type Props = {
  message: IUserMessage;
  setReply: (msg: IUserMessage | null) => void;
};

export const ReplyContainer: React.FC<Props> = ({ message, setReply }) => {
  return (
    <div className={css["reply-wrapper"]}>
      <ReplyPreview className={css.reply} message={message} />
      <button className={css.reply__cross} onClick={() => setReply(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <line x1="10" x2="90" y1="90" y2="10" />
          <line x1="10" x2="90" y1="10" y2="90" />
        </svg>
      </button>
    </div>
  );
};
