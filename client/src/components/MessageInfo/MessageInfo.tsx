import React from "react";
import { cx, formatDate } from "../../utils";
import css from "./MessageInfo.module.css";

type Props = {
  date: string;
  author?: string;
};

type DateProps = {
  date: string;
  className?: string;
};

const Date: React.FC<DateProps> = ({ date, className }) => {
  return (
    <div
      title={formatDate({ date, format: "long" })}
      className={cx(css.message__date, className)}
    >
      {formatDate({ date, format: "short" })}
    </div>
  );
};

export const MessageInfo: React.FC<Props> = ({ date, author }) => {
  return (
    <>
      {author ? (
        <div className={css.message__info}>
          <div className={css["message__author-name"]}>{author}</div>
          <Date date={date} />
        </div>
      ) : (
        <Date date={date} className={css["date-only"]} />
      )}
    </>
  );
};
