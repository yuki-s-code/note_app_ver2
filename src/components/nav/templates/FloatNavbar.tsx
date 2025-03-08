import { FC } from "react";
import { selectNav, setNav } from "../../../slices/navSlice";
import { useAppDispatch, useAppSelector } from "../../../libs/app/hooks";
import Header from "../atoms/Header";
import NavCheck from "../molecules/NavCheck";
import NavCom from "../molecules/NavCom";
import NavHome from "../molecules/NavHome";
import Navname from "../molecules/NavName";
import NavItem from "../organisms/NavItem";
import NavTitle from "../organisms/NavTitle";

type Props = {
  title: string;
  header: string;
  children: React.ReactNode;
};

const FloatNavbar = () => {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(selectNav);

  const openNav = (i: string) => {
    dispatch(setNav({ name: i }));
  };
  return (
    <nav className="">
      <div className="flex flex-col">
        <ul className="relative list-none h-screen">
          <div
            className=" hover:text-gray-600 cursor-pointer"
            onClick={() => openNav(window.localStorage.sns_id)}
            onKeyDown={() => openNav(window.localStorage.sns_id)}
          >
            TOP
          </div>
          <div
            className=" hover:text-gray-600 cursor-pointer"
            onClick={() => openNav("")}
            onKeyDown={() => openNav("")}
          >
            DASHBOARD
          </div>
          <div
            className=" hover:text-gray-600 cursor-pointer"
            onClick={() => openNav("news")}
            onKeyDown={() => openNav("news")}
          >
            News
          </div>
          <div
            className=" hover:text-gray-600 cursor-pointer"
            onClick={() => openNav("calendar")}
            onKeyDown={() => openNav("calendar")}
          >
            Calendar
          </div>
          <div
            className=" hover:text-gray-600 cursor-pointer"
            onClick={() => openNav("task")}
            onKeyDown={() => openNav("task")}
          >
            Task
          </div>
        </ul>
      </div>
    </nav>
  );
};
export default FloatNavbar;
