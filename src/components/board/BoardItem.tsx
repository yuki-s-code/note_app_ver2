import {
  selectEditedBoardList,
  setEditedBoardModal,
  setEditedBoardList,
} from "../../slices/boardSlice";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import { setCreateCommentModal } from "../../slices/boardSlice";
import progress from "../../libs/utils/progress";
import { useMutateBoard } from "@/libs/hooks/boardHook/useMutateBoard";

type ItemProps = { item: any };

const BoardItem = ({ item }: ItemProps) => {
  const dispatch = useAppDispatch();
  const itemList: any = useAppSelector(selectEditedBoardList);
  const prog = progress(item.createdAt);

  const { boardFollowMutation, boardDeleteFollowMutation }: any =
    useMutateBoard();

  const commentModalHandler = (e: boolean) => {
    dispatch(
      setEditedBoardList({
        ...itemList,
        _id: item._id,
        display: item.display,
        contents: item.contents,
        comment: item.comment,
        user: item.user,
        tag: item.tag,
        favorite: item.favorite,
      })
    );
    dispatch(
      setCreateCommentModal({
        open: e,
      })
    );
  };

  const createModalHandler = (e: boolean) => {
    dispatch(
      setEditedBoardList({
        ...itemList,
        _id: item._id,
        display: item.display,
        contents: item.contents,
        comment: item.comment,
        user: item.user,
        tag: item.tag,
        favorite: item.favorite,
      })
    );
    dispatch(
      setEditedBoardModal({
        open: e,
      })
    );
  };

  const commentCount = (m: any) => {
    return m.length;
  };

  const favoriteListHandler = (e: any) => {
    e.preventDefault();
    if (item.favorite.includes(window.localStorage.sns_id)) {
      boardDeleteFollowMutation.mutate({
        boardId: item._id,
        user: window.localStorage.sns_id,
      });
    } else {
      boardFollowMutation.mutate({
        boardId: item._id,
        user: window.localStorage.sns_id,
      });
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <div className="flex px-4 py-3 border-b-gray-50">
        <div className="h-10 w-10 rounded flex-shrink-0 bg-gray-300" />
        <div className="ml-2">
          <div
            className="hover:bg-gray-300 cursor-pointer px-2"
            onClick={() => createModalHandler(true)}
          >
            <div>
              <span className="text-sm font-semibold">{item.user}</span>
              <span className="ml-1 text-xs text-gray-500">
                {item.createdAt}
              </span>
            </div>
            <div className="text-sm p-2">{item.contents}</div>
          </div>
          <div className="flex space-x-4 items-center -my-4">
            <div className="p-2 -mt-2">
              <a
                href="#"
                className="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium"
                onClick={() => commentModalHandler(true)}
              >
                <svg
                  className="text-center h-6 w-6 hover:bg-blue-800 hover:text-blue-300  rounded-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </a>
              <div className="ml-10 -mt-8 text-sm text-gray-500">
                {commentCount(item.comment)}
              </div>
            </div>
            <div className="p-2 m-2">
              <a
                href="#"
                className="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-blue-800 hover:text-blue-300"
              >
                <svg
                  className="text-center h-7 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </a>
            </div>
            <div
              className="p-2 flex-1 text-center py-2 m-2"
              onClick={(e) => favoriteListHandler(e)}
            >
              <a
                href="#"
                className="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-blue-800 hover:text-blue-300"
              >
                <svg
                  className="text-center h-7 w-6"
                  fill={
                    item.favorite.includes(window.localStorage.sns_id)
                      ? "text-gray-500"
                      : "none"
                  }
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </a>
            </div>
          </div>
          {/* <div className=" w-full text-xs flex">
            <>
              {hashTagExtractor(item).map((i: any, l: any) => (
                <span key={l} className=" bg-blue-100 ml-1 p-2 rounded-3xl">
                  {i}
                </span>
              ))}
            </>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <hr className="w-full" />
        <span className="flex items-center justify-center -mt-3 bg-white h-6 px-3 rounded-full border text-xs font-semibold mx-auto">
          {prog}
        </span>
      </div>
    </div>
  );
};
export default BoardItem;
