//Page1.tsx

import { selectEditedBoardModal } from "../../slices/boardSlice";
import { useAppSelector } from "../../libs/app/hooks";
import Friend from "./Friend";
import Profile from "./Profile";
import TimeLine from "./TimeLine";
import menProfileIcon from "../../assets/icons_user_group.png";
import newsIcon from "../../assets/icons_news.png";
import { memo } from "react";
import { Footer } from "./Footer";
import { BoardPlayGround } from "../board/BoardPlayground";

const Page1 = memo(() => {
  const createModal: any = useAppSelector(selectEditedBoardModal);

  return (
    <div className="w-screen p-4">
      {/* <Secondary /> */}
      <div className="flex">
        <div className="w-full">
          <Profile />
          <div>
            <img
              className="h-12 w-12 ml-6 object-cover object-center"
              src={menProfileIcon}
              alt=""
            />
            <div className="-mt-4">
              <Friend />
            </div>
          </div>
        </div>
        <div className="w-full p-4">
          <div className="flex">
            <img
              className="h-12 w-12 object-cover object-center -ml-16"
              src={newsIcon}
              alt=""
            />
          </div>
          <div className="-mt-4 -ml-16">
            <TimeLine />
          </div>
        </div>
      </div>
      <div>{createModal.open && <BoardPlayGround />}</div>
      <Footer />
    </div>
  );
});
export default Page1;
