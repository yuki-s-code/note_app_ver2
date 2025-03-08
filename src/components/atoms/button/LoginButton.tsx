import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const LoginButton: FC<Props> = (props) => {
  const { children } = props;
  return (
    <button className="bg-gray-500 hover:bg-gray-200 text-white font-bold rounded p-3">
      {children}
    </button>
  );
};
