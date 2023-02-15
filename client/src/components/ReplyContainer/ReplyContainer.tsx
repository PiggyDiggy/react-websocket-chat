import React, { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { IUserMessage } from "../../types";
import { ReplyPreview } from "../ReplyPreview";
import css from "./ReplyContainer.module.css";

type Props = {
  message: IUserMessage | null;
  setReply: (msg: IUserMessage | null) => void;
};

export const ReplyContainer: React.FC<Props> = ({ message, setReply }) => {
  const prevMessage = usePrevious(message);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      timeout={200}
      nodeRef={containerRef}
      in={message !== null}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: css["reply-enter"],
        enterActive: css["reply-enter-active"],
        exit: css["reply-exit"],
        exitActive: css["reply-exit-active"],
      }}
    >
      <div className={css["scalable-container"]} ref={containerRef}>
        <div className={css["reply-wrapper"]}>
          <ReplyPreview
            className={css.reply}
            message={(message || prevMessage) as IUserMessage}
          />
          <button className={css.reply__cross} onClick={() => setReply(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <line x1="10" x2="90" y1="90" y2="10" />
              <line x1="10" x2="90" y1="10" y2="90" />
            </svg>
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
