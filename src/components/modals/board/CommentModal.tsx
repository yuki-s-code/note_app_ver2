import {
  resetCommentList,
  selectCommentList,
  selectEditedBoardList,
  setCommentList,
  setCreateCommentModal,
} from "../../../slices/boardSlice";
import { useAppDispatch, useAppSelector } from "../../../libs/app/hooks";
import { useMutateBoard } from "../../../libs/hooks/boardHook/useMutateBoard";
import uid from "../../../libs/utils/uid";
import { extractTextFromJSON } from "@/components/board/utils/extractTextFromJson";

const CommentModal = () => {
  const dispatch = useAppDispatch();
  const uuid: any = uid();
  const dateList: any = new Date();
  const { _id, contents } = useAppSelector(selectEditedBoardList);
  const commentList: any = useAppSelector(selectCommentList);
  console.log(commentList);

  const { addBoardCommentMutation, editedBoardCommentMutation }: any =
    useMutateBoard();

  const newComment = () => {
    const com = {
      ...commentList,
      id: uuid,
      updatedAt: dateList,
      createdAt: dateList,
      commenter: window.localStorage.sns_id,
    };
    return com;
  };

  const saveHandler = (e: any) => {
    e.preventDefault();
    if (commentList.id) {
      editedBoardCommentMutation.mutate({
        idx: _id,
        boardComment: commentList,
      });
    } else {
      addBoardCommentMutation.mutate({
        idx: _id,
        boardComment: newComment(),
      });
    }
    dispatch(resetCommentList());
    dispatch(
      setCreateCommentModal({
        open: false,
      })
    );
  };

  const commentInputHandler = (e: any) => {
    dispatch(
      setCommentList({
        ...commentList,
        contents: e.target.value,
      })
    );
  };
  const commentModalHandler = (e: boolean) => {
    dispatch(
      setCreateCommentModal({
        open: e,
      })
    );
    dispatch(resetCommentList());
  };

  return (
    <div className="fixed z-0 w-full h-full top-0 left-0 flex items-center justify-center">
      <div
        role="button"
        tabIndex={0}
        className="modal-overlay absolute z-0 w-full h-full bg-gray-900 opacity-50"
        onClick={() => commentModalHandler(false)}
      />
      <div className="z-50 flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
        <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
          <div className="whitespace-nomal font-semibold text-gray-800">
            {/* {contents.blocks[0].text} */}
            {/* <div dangerouslySetInnerHTML={{ __html: contents }} /> */}
            <div>{contents}</div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => commentModalHandler(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <div className="flex flex-col px-6 py-5 bg-gray-50">
          <div className="mb-2 font-semibold text-gray-700">コメントを追加</div>
          <textarea
            name=""
            value={commentList.contents}
            onChange={(e) => commentInputHandler(e)}
            placeholder="Type message..."
            className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-36"
            id=""
          />
          <hr />
        </div>
        <div className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
          <div
            className="font-semibold text-gray-600 cursor-pointer"
            onClick={() => commentModalHandler(false)}
          >
            Cancel
          </div>
          <button
            className="px-4 py-2 text-white font-semibold bg-blue-500 rounded"
            onClick={(e) => saveHandler(e)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentModal;
