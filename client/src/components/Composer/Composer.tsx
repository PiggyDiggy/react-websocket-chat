import { useContext } from "react";

import { SocketContext } from "@/pages/Chat";
import { ReplyContainer } from "@/features/Reply";

import { MessageInput } from "../MessageInput";
import { MessageInputSkeleton } from "../MessageInput/Skeleton";

import css from "./Composer.module.css";

export const Composer = () => {
  const socket = useContext(SocketContext);

  return (
    <div className={css.composer}>
      <ReplyContainer />
      {socket ? <MessageInput /> : <MessageInputSkeleton />}
    </div>
  );
};
