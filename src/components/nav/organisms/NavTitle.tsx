import { FC } from 'react';
import {
  NavNote,
  NavCalendar,
  NavMessage,
  NavProfile,
  NavHelp,
  NavTask,
} from '../atoms/NavSeries';

type Props = {
  title: string;
};

const NavTitle: FC<Props> = ({ title }) => {
  return (
    <div className="text-white bg-blue-400 flex flex-shrink-0 flex-col">
      <div className="flex relative p-3 h-12">
        {title === 'Note' && <NavNote />}
        {title === 'Calendar' && <NavCalendar />}
        {title === 'Task' && <NavTask />}
        {title === 'Message' && <NavMessage />}
        {title === 'profile' && <NavProfile />}
        {title === 'Help' && <NavHelp />}
        <span className="text-2xl tracking-wide">{title}</span>
      </div>
    </div>
  );
};
export default NavTitle;
