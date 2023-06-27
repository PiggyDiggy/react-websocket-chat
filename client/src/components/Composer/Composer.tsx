import { MessageInput } from "@/components/MessageInput";

import { ReplyContainer } from "../../features/Reply";

import css from "./Composer.module.css";

export const Composer = () => {
  return (
    <div className={css.composer}>
      <ReplyContainer />
      <MessageInput />
    </div>
  );
};
