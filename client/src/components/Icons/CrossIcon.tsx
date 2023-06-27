import React from "react";

type Props = {
  className?: string;
};

export const CrossIcon: React.FC<Props> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <line x1="10" x2="90" y1="90" y2="10" />
    <line x1="10" x2="90" y1="10" y2="90" />
  </svg>
);
