import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import type { RootState } from "@/store";
import { SocketContext } from "@/App";
import { User } from "@/types";

import css from "./ActivityBar.module.css";

export const ActivityBar = () => {
  const [activity, setActivity] = useState("");
  const user = useSelector((state: RootState) => state.self.user) as User;
  const socket = useContext(SocketContext) as Socket;

  useEffect(() => {
    function formatActivity(usersList: User[]) {
      const list = usersList.filter((u) => u.id !== user.id);

      if (list.length === 0) {
        return "";
      }

      if (list.length === 1) {
        return `${list[0].name} is typing`;
      }

      return `${list
        .slice(0, -1)
        .map((user) => user.name)
        .join(", ")} and ${list[list.length - 1].name} are typing`;
    }

    socket.on("user:activity", (list) => {
      setActivity(formatActivity(list));
    });
  }, [socket, user]);

  return (
    <>
      {activity.length !== 0 && (
        <div className={css.activity}>
          <span>{activity}</span>
          <span className={css.activity__icon}>
            <div className={css["activity__icon-part"]}></div>
            <div className={css["activity__icon-part"]}></div>
            <div className={css["activity__icon-part"]}></div>
          </span>
        </div>
      )}
    </>
  );
};
