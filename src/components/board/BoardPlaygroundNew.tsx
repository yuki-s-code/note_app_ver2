import { useAppDispatch } from "@/libs/app/hooks";
import { useMutateBoard } from "@/libs/hooks/boardHook/useMutateBoard";
import { resetNewBoardModal } from "@/slices/boardSlice";
import { Textarea, Button, IconButton, Input } from "@material-tailwind/react";
import { useState } from "react";

export const BoardPlayGroundNew = () => {
  const dispatch = useAppDispatch();
  const [comment, setComment]: any = useState("");
  const [tagName, setTagName] = useState("");
  const [tagImage, setTagImage] = useState(true);
  const { createBoardMutation }: any = useMutateBoard();

  const onChangeComment = (e: any) => {
    console.log(e.target.value);
    setComment(e.target.value);
  };

  const toggleTagInput = () => {
    setTagImage(!tagImage); // 入力モードと表示モードを切り替える
  };

  const modalOpenHandler = () => {
    dispatch(resetNewBoardModal());
  };

  const saveHandler = (e: any) => {
    e.preventDefault(e);
    createBoardMutation.mutate({
      contents: comment,
      user: window.localStorage.sns_id,
      tag: tagName,
    });
    dispatch(resetNewBoardModal());
  };
  return (
    <>
      <div className="fixed z-0 w-full h-full top-0 left-0 flex items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          className="modal-overlay absolute z-0 w-full h-full bg-gray-900 opacity-50"
          onClick={() => {
            modalOpenHandler();
          }}
        />
        <div className=" modal-container ml-16 h-5/6 absolute bg-white w-6/12 rounded shadow-lg overflow-y-auto z-50">
          <div className="p-8">
            <div className="relative w-full">
              <Textarea
                size="lg"
                label="投稿内容を記載"
                value={comment}
                onPointerEnterCapture
                onPointerLeaveCapture
                onChange={onChangeComment}
              />
              {tagImage ? (
                <input
                  placeholder="タグをカンマ区切りで入力"
                  className="w-full text-sm resize-none border-none outline-none"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  onBlur={toggleTagInput} // フォーカスが外れたら表示モードに切り替え
                />
              ) : (
                <div onClick={toggleTagInput} className="">
                  {tagName.split(",").map(
                    (tag, index) =>
                      tag.trim() !== "" && (
                        <span
                          key={index}
                          className="cursor-pointer hover:bg-green-300 tag bg-green-100 text-blue-gray-600 rounded-3xl py-1 px-2 ml-2 "
                        >
                          {tag}
                        </span>
                      )
                  )}
                  {tagName === "" && <span>タグを追加</span>}
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
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-md"
                    onClick={(e) => {
                      saveHandler(e);
                    }}
                    placeholder="true"
                    onPointerEnterCapture
                    onPointerLeaveCapture
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
