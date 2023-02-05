import React from "react";
import { User } from "../../types";
import { UserSummary } from "../UserSummary";
import css from "./UserList.module.css";

type Props = {
  users: User[];
};

export const UserList: React.FC<Props> = ({ users }) => {
  function sortByOnlineStatus() {
    return users.slice().sort((a, b) => {
      if (a.online && !b.online) return -1;
      if (!a.online && b.online) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  return (
    <ul className={css["user-list"]}>
      {sortByOnlineStatus().map((user) => (
        <UserSummary user={user} key={user.id} />
      ))}
    </ul>
  );
};
