import React from "react";
import { useSelector } from "react-redux";

import { LogoutIcon } from "@/components/Icons/LogoutIcon";
import { UsersIcon } from "@/components/Icons/UsersIcon";
import { ActivityBar } from "@/components/ActivityBar";

import { cx } from "../../utils";

import { selectActiveUsersCount } from "./selectors";
import css from "./Header.module.css";

type Props = {
  logout: () => void;
  openSidebar: () => void;
};

export const Header: React.FC<Props> = ({ logout, openSidebar }) => {
  const activeUsersCount = useSelector(selectActiveUsersCount);

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
        <button className={cx(css.header__button, css["logout-button"])} onClick={logout} title="Logout">
          <LogoutIcon className={css.header__icon} arrowClassName={css["logout-icon__arrow"]} />
        </button>
      </div>
    </header>
  );
};
