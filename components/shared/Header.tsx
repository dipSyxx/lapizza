import React from "react";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return <div className={className}>Header</div>;
};
