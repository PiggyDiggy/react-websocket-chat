import React from "react";

import { cx } from "@/utils";

import css from "./Spin.module.css";

type Props = {
  className?: string;
};

export const Spin: React.FC<Props> = ({ className }) => {
  return (
    <div className={cx(className, css.container)}>
      <div className={css.spin}></div>
    </div>
  );
};
