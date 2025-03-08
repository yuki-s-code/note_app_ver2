import {
  selectEditedBoardModal,
  selectCreateCommentModal,
  selectNewBoardModal,
} from "../../slices/boardSlice";
import { useAppSelector } from "../../libs/app/hooks";
import CommentModal from "../modals/board/CommentModal";
import BoardInput from "./BoardInput";
import BoardTab from "./BoardTab";
import { BoardPlayGroundNew } from "./BoardPlaygroundNew";
import { BoardPlayGround } from "./BoardPlayground";
import { FC } from "react";

const Board: FC = () => {
  const { open }: any = useAppSelector(selectCreateCommentModal);
  const editedModal: any = useAppSelector(selectEditedBoardModal);
  const newModal: any = useAppSelector(selectNewBoardModal);
  return (
    <div className="w-screen h-full">
      <div className="w-full h-full overflow-auto">
        <div>{newModal.open && <BoardPlayGroundNew />}</div>
        <div>{open && <CommentModal />}</div>
        <div>{editedModal.open && <BoardPlayGround />}</div>
        <div className="h-full w-full flex">
          <div className="w-10/12 h-96">
            <BoardTab />
          </div>
        </div>
        <div className="fixed right-4 bottom-4">
          <BoardInput />
        </div>
      </div>
    </div>
  );
};
export default Board;
