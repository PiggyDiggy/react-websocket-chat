import React from "react";
import css from "./Avatar.module.css";

type Props = {
  name: string;
};

export const Avatar: React.FC<Props> = ({ name }) => {
  function getInitials() {
    const words = name.split(" ");
    if (words.length > 1) {
      return words[0].charAt(0) + words[1].charAt(0);
    }
    return name.charAt(0);
  }

  return <div className={css.avatar}>{getInitials()}</div>;
};
