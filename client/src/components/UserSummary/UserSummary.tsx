import React, { useContext } from "react";
import { SocketContext } from "../../App";
import { User } from "../../types";
import { cx } from "../../utils";
import { Avatar } from "../Avatar";
import css from "./UserSummary.module.css";

type Props = {
  user: User;
};

export const UserSummary: React.FC<Props> = ({ user }) => {
  const socket = useContext(SocketContext);
  return (
    <li className={cx(css.wrapper, { [css["user--online"]]: user.online })}>
      <Avatar name={user.name} className={css.user__avatar} />
      <div className={css.user__info}>
        <div className={css.user__name}>
          {user.name} {user.id === socket?.id && "(you)"}
        </div>
        <small className={css.user__status}>
          {user.online ? "online" : "offline"}
        </small>
      </div>
    </li>
  );
};
