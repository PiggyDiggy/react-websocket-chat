import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { revertAll } from "@/store";
import { SocketContext } from "@/pages/Chat";
import { LogoutIcon } from "@/components/Icons/LogoutIcon";
import { UsersIcon } from "@/components/Icons/UsersIcon";
import { ActivityBar } from "@/components/ActivityBar";

import { cx } from "../../utils";

import { selectActiveUsersCount } from "./selectors";
import css from "./Header.module.css";

type Props = {
  openSidebar: () => void;
};

export const Header: React.FC<Props> = ({ openSidebar }) => {
  const dispatch = useDispatch();
  const activeUsersCount = useSelector(selectActiveUsersCount);
  const socket = useContext(SocketContext);

  const handleLogout = () => {
    socket?.emit("user:leave-channel");
    localStorage.removeItem("chat-session-id");
    dispatch(revertAll());
  };

  return (
    <header className={css.header}>
      <div className={css.header__buttons}>
        <div>
          <button onClick={openSidebar} className={css.header__button} title="Show Users">
            <UsersIcon className={css.header__icon} />
            <div className={css["users-count"]}>{activeUsersCount}</div>
          </button>
          <ActivityBar />
        </div>
        <button className={cx(css.header__button, css["logout-button"])} onClick={handleLogout} title="Logout">
          <LogoutIcon className={css.header__icon} arrowClassName={css["logout-icon__arrow"]} />
        </button>
      </div>
    </header>
  );
};
