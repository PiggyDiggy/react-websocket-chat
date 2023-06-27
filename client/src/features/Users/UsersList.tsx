import { useSelector } from "react-redux";

import { UserSummary } from "@/components/UserSummary";

import { selectUsers } from "./selectors";
import css from "./UsersList.module.css";

export const UsersList = () => {
  const users = useSelector(selectUsers);

  return (
    <ul className={css["user-list"]}>
      {users.map((user) => (
        <UserSummary user={user} key={user.id} />
      ))}
    </ul>
  );
};
