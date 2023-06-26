import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "@/store";
import { usePrevious } from "@/hooks/usePrevious";
import { IUserMessage } from "@/types";
import { ReplyPreview } from "@/components/ReplyPreview";

import { setReply } from "./replySlice";
import css from "./ReplyContainer.module.css";

export const ReplyContainer = () => {
  const dispatch = useDispatch();
  const reply = useSelector((state: RootState) => state.reply.message);
  const prevReply = usePrevious(reply);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      timeout={200}
      nodeRef={containerRef}
      in={reply !== null}
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
          <ReplyPreview className={css.reply} message={(reply || prevReply) as IUserMessage} />
          <button className={css.reply__cross} onClick={() => dispatch(setReply(null))}>
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
