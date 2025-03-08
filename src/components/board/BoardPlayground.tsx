import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { useMutateBoard } from "@/libs/hooks/boardHook/useMutateBoard";
import progress from "@/libs/utils/progress";
import {
  resetCommentList,
  resetEditedBoardList,
  resetEditedBoardModal,
  selectCommentList,
  selectEditedBoardList,
  setCommentList,
  setCreateCommentModal,
  setEditedBoardList,
  setEditedBoardModal,
} from "@/slices/boardSlice";
import { Button, IconButton, Textarea } from "@material-tailwind/react";
import { useState } from "react";

export const BoardPlayGround = () => {
  const dispatch = useAppDispatch();
  const item: any = useAppSelector(selectEditedBoardList);
  const commentList: any = useAppSelector(selectCommentList);
  const [tagImage, setTagImage] = useState(false);
  const { editedBoardMutation }: any = useMutateBoard();

  const toggleTagInput = () => {
    setTagImage(!tagImage); // 入力モードと表示モードを切り替える
  };

  const setChangeContents = (e: any) => {
    dispatch(
      setEditedBoardList({
        ...item,
        contents: e.target.value,
      })
    );
  };

  const setChangeTag = (e: any) => {
    dispatch(
      setEditedBoardList({
        ...item,
        tag: e,
      })
    );
  };

  const createModalHandler = (e: boolean) => {
    dispatch(
      setEditedBoardModal({
        open: e,
      })
    );
    dispatch(resetCommentList());
  };

  const createCommentModalHandler = (e: boolean, c: any) => {
    dispatch(
      setCommentList({
        ...commentList,
        id: c.id,
        contents: c.contents,
        commenter: window.localStorage.sns_id,
        favorite: c.favorite,
        createdAt: c.createdAt,
        updatedAt: new Date(),
      })
    );
    dispatch(
      setCreateCommentModal({
        open: e,
      })
    );
    dispatch(
      setEditedBoardModal({
        open: false,
      })
    );
  };

  const modalOpenHandler = () => {
    dispatch(resetEditedBoardModal());
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    editedBoardMutation.mutate({
      contents: item.contents,
      tag: item.tag,
      id: item._id,
    });
    dispatch(resetEditedBoardList());
  };

  return (
    <div className="fixed z-0 w-full h-full top-0 left-0 flex items-center justify-center">
      <div
        role="button"
        tabIndex={0}
        className="modal-overlay absolute z-0 w-full h-full bg-gray-900 opacity-50"
        onClick={() => {
          modalOpenHandler();
        }}
      />
      <div className=" modal-container ml-16 h-5/6 absolute bg-white w-7/12 rounded shadow-lg overflow-y-auto z-50 p-14">
        <Textarea
          size="lg"
          label="投稿内容を記載"
          value={item.contents}
          onPointerEnterCapture
          onPointerLeaveCapture
          onChange={setChangeContents}
        />
        {tagImage ? (
          <input
            placeholder="タグをカンマ区切りで入力"
            className="w-full text-sm resize-none border-none outline-none"
            value={item.tag || ""}
            onChange={(e) => setChangeTag(e.target.value)}
            onBlur={toggleTagInput} // フォーカスが外れたら表示モードに切り替え
          />
        ) : (
          <div onClick={toggleTagInput}>
            {item.tag ? (
              item.tag.split(",").map(
                (tag: any, index: any) =>
                  tag.trim() !== "" && (
                    <span
                      key={index}
                      className="cursor-pointer hover:bg-green-300 tag bg-green-100 text-blue-gray-600 rounded-3xl py-1 px-2 ml-2 "
                    >
                      {tag}
                    </span>
                  )
              )
            ) : (
              <>{<span className=" text-blue-gray-400">タグを追加</span>}</>
            )}
          </div>
        )}
        <div className="flex w-full justify-between py-1.5">
          <IconButton
            variant="text"
            color="blue-gray"
            size="sm"
            placeholder="true"
            onPointerEnterCapture
            onPointerLeaveCapture
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </IconButton>
          <div className="flex gap-2">
            <Button
              size="sm"
              color="red"
              variant="text"
              className="rounded-md"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              onClick={(e) => {
                createModalHandler(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-md"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              onClick={(e) => {
                submitHandler(e);
                createModalHandler(false);
              }}
            >
              Post
            </Button>
          </div>
        </div>
        <div>
          <div className="-mb-4 text-blue-400 text-xs mt-4">コメント</div>
          {item.comment?.map((c: any, i: any) => (
            <div
              key={i}
              className="h-auto mt-4 cursor-pointer hover:bg-gray-200"
              onClick={() => createCommentModalHandler(true, c)}
            >
              <div className="flex p-2 text-xm text-slate-400 ">
                <div className="h-10 w-10 rounded flex-shrink-0 bg-gray-300" />
                <div className="ml-2">{c.commenter}</div>
                <div className="ml-2">{c.updatedAt}</div>
              </div>
              <div>
                <p className="whitespace-normal ml-12 -mt-4 text-lg tracking-tight font-light text-black leading-6 px-2">
                  {c.contents}
                </p>
              </div>
              <div className="flex flex-col items-center mt-8">
                <hr className="w-full" />
                <span className="flex items-center justify-center -mt-3 bg-white h-6 px-3 rounded-full border text-xs font-semibold mx-auto">
                  {progress(c.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
