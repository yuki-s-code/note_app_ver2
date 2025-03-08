import { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const NavName: FC<Props> = ({ children }) => {
  return (
    <li className="p-4 flex shadow-sm">
      <div className="my-1">
        <span className="text-white font-medium">{children}</span>
      </div>
    </li>
  );
};
export default NavName;
