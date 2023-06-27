import React from "react";

type Props = {
  className?: string;
};

export const MessageCorner: React.FC<Props> = ({ className }) => (
  <svg className={className} width="9" height="17" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
        fill="#000"
      ></path>
      <path
        d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
        fill="#FFF"
      ></path>
    </g>
  </svg>
);
