import React from "react";

type Props = {
  className?: string;
  arrowClassName?: string;
};

export const LoginIcon: React.FC<Props> = ({ className, arrowClassName }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <g className={arrowClassName}>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </g>
  </svg>
);
