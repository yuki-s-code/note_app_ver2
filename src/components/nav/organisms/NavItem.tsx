import { FC } from "react";
import {
  NavNote,
  NavCalendar,
  NavMessage,
  NavProfile,
  NavHelp,
  NavTask,
  NavBoard,
} from "../atoms/NavSeries";

type NavItemProps = {
  children: React.ReactNode;
  // isActive: boolean
};

const NavItem: FC<NavItemProps> = ({ children }) => {
  return (
    <div className="text-blue-400 flex px-4 py-2 hover:bg-gray-700 cursor-pointer">
      <div className="mr-4 my-auto">
        {children === "Note" && <NavNote />}
        {children === "News" && <NavBoard />}
        {children === "Message" && <NavMessage />}
        {children === "Calendar" && <NavCalendar />}
        {children === "Profile" && <NavProfile />}
        {children === "Help" && <NavHelp />}
        {children === "Task" && <NavTask />}
      </div>
      <div className="flex-auto my-1">
        <span>{children}</span>
      </div>
    </div>
  );
};
export default NavItem;
