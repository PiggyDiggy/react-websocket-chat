import React from "react";
import { cx } from "../../utils";
import css from "./Avatar.module.css";

type Props = {
  name: string;
  className?: string;
};

export const Avatar: React.FC<Props> = ({ name, className }) => {
  function getInitials() {
    const words = name.split(" ");
    if (words.length > 1) {
      return words[0].charAt(0) + words[1].charAt(0);
    }
    return name.charAt(0);
  }

  return <div className={cx(css.avatar, className)}>{getInitials()}</div>;
};
