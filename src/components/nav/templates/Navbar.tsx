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

const Navbar: FC<Props> = ({ title, header, children }) => {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(selectNav);

  const openNav = (i: string) => {
    dispatch(setNav({ name: i }));
  };
  return (
    <div className="flex h-screen fixed">
      <Header header={header} />
      <nav className=" w-48 flex-shrink-0">
        <div className="flex-auto bg-gray-900 h-screen">
          <div className="flex flex-col">
            <ul className="relative list-none h-screen">
              <NavCom />
              <div
                role="button"
                tabIndex={0}
                onClick={() => openNav(window.localStorage.sns_id)}
                onKeyDown={() => openNav(window.localStorage.sns_id)}
              >
                <NavHome>{window.localStorage.sns_id}</NavHome>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => openNav("")}
                onKeyDown={() => openNav("")}
              >
                <Navname>DASHBOARD</Navname>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={name === "news" ? "bg-slate-300" : ""}
                onClick={() => openNav("news")}
                onKeyDown={() => openNav("news")}
              >
                <NavItem>News</NavItem>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={name === "calendar" ? "bg-slate-300" : ""}
                onClick={() => openNav("calendar")}
                onKeyDown={() => openNav("calendar")}
              >
                <NavItem>Calendar</NavItem>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={name === "task" ? "bg-slate-300" : ""}
                onClick={() => openNav("task")}
                onKeyDown={() => openNav("task")}
              >
                <NavItem>Task</NavItem>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={name === "message" ? "bg-slate-300" : ""}
              >
                <NavItem>Message</NavItem>
              </div>

              <div
                role="button"
                tabIndex={0}
                className={name === "note" ? "bg-slate-300" : ""}
                onClick={() => openNav("note")}
                onKeyDown={() => openNav("note")}
              >
                <NavItem>Note</NavItem>
              </div>
            </ul>
          </div>
        </div>
      </nav>

      <div className="flex flex-col w-10/12">
        <NavCheck title={title} />
        <NavTitle title={title} />
        {children}
      </div>
    </div>
  );
};
export default Navbar;
