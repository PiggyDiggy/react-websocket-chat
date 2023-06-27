import React from "react";
import { useSelector } from "react-redux";

import { UserSummary } from "@/components/UserSummary";

import { selectUsers } from "./selectors";
import css from "./UsersList.module.css";

const UserSummaryMemo = React.memo(UserSummary);

export const UsersList = () => {
  const users = useSelector(selectUsers);

  return (
    <ul className={css["user-list"]}>
      {users.map((user) => (
        <UserSummaryMemo user={user} key={user.id} />
      ))}
    </ul>
  );
};
