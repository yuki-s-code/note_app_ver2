import React from 'react';

type HeaderProps = {
  header: string;
};

const Header: React.FC<HeaderProps> = ({ header }) => {
  return (
    <header>
      <title>{header}</title>
    </header>
  );
};
export default Header;
