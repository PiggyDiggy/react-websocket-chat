import React from "react";

type Props = {
  className?: string;
  arrowClassName?: string;
};

export const LogoutIcon: React.FC<Props> = ({ className, arrowClassName }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <g className={arrowClassName}>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </g>
  </svg>
);
