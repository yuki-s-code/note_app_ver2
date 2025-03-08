//Profile.tsx

import icon from "../../assets/profile_bg.png";
import menProfileIcon from "../../assets/icons_men_user.png";
import { memo } from "react";

const Profile = memo(() => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 w-4/5">
      <div className="relative flex flex-col rounded-[20px] w-full mx-auto p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
        <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
          <img
            src={icon}
            alt=""
            className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
          />
          <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
            <img
              className="h-full w-full rounded-full"
              src={menProfileIcon}
              alt=""
            />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <div className="text-xl font-bold text-navy-700 text-black">Yuki</div>
        </div>
      </div>
    </div>
  );
});
export default Profile;
