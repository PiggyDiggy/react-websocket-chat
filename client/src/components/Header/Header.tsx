import React from "react";
import { cx } from "../../utils";
import css from "./Header.module.css";

type Props = {
  logout: () => void;
  openSidebar: () => void;
  usersCount: number;
};

export const Header: React.FC<Props> = ({
  logout,
  openSidebar,
  usersCount,
}) => {
  return (
    <header className={css.header}>
      <div className={css.header__buttons}>
        <button
          onClick={openSidebar}
          className={css.header__button}
          title="Show Users"
        >
          <svg
            className={css.header__icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div className={css["users-count"]}>{usersCount}</div>
        </button>
        <button
          className={cx(css.header__button, css["logout-button"])}
          onClick={logout}
          title="Logout"
        >
          <svg
            className={css.header__icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <g className={css["logout-icon__arrow"]}>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </g>
          </svg>
        </button>
      </div>
    </header>
  );
};
