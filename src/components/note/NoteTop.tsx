// NoteTop.tsx
import React, { memo, useCallback, useState } from "react";
import { useAppDispatch } from "@/libs/app/hooks";
import { setTitleId } from "@/slices/noteSlice";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { FcEmptyTrash, FcFullTrash } from "react-icons/fc";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import CreateRootFolder from "./CreateRootFolder";
import { NoteTreeCompose } from "./NoteTreeCompose";
import { BookmarkList } from "./BookmarkList";
import { SearchNote } from "./SearchNote";
import { useQueryTrashList } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { nanoid } from "nanoid";
import { CalendarDaysIcon } from "lucide-react";
import { getData } from "./utils/getData";

const NoteTop = memo(() => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const { data, status } = useQueryTrashList(5);
  const todayX = dayjs().format("YYYY-MM-DD");

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const toggleTrashOpen = useCallback(() => {
    setTrashOpen((prev) => !prev);
  }, []);

  const onClickOpenJournal = () => {
    // Clear local storage logic...
    dispatch(
      setTitleId({
        index: nanoid(),
        dataItem: todayX,
        dataIcon: "",
        dataImage: "",
        dataType: "calendar",
      })
    );
    getData({ index: todayX, type: "journals" });
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div className="hover-scrollbar fixed overflow-y-scroll max-h-[calc(100vh-60px)] overflow-x-hidden">
      <div className={`text-xs h-1/6 pt-3 ${open ? "scrollbar-hidden" : ""}`}>
        <div className="flex">
          <div
            className="pl-4 w-12 text-gray-400 hover:text-gray-500 font-bold cursor-pointer"
            onClick={toggleOpen}
          >
            検索
          </div>
          <SearchNote open={open} setOpen={setOpen} />
          <div className="-mt-1">
            {data?.docs?.length ? (
              <FcFullTrash
                onClick={toggleTrashOpen}
                className="text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
              />
            ) : (
              <FcEmptyTrash
                onClick={toggleTrashOpen}
                className="text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
              />
            )}
            <Dialog
              open={trashOpen}
              handler={toggleTrashOpen}
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
            >
              <DialogHeader
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                ゴミ箱一覧
              </DialogHeader>
              <DialogBody
                className="h-96 overflow-y-auto"
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                {data?.docs?.map((d: any, i: any) => (
                  <div key={i} className="flex">
                    <div>{d.data.icon}</div>
                    <div>{d.data.title}</div>
                  </div>
                ))}
              </DialogBody>
              <DialogFooter
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                <Button
                  placeholder="true"
                  onPointerEnterCapture
                  onPointerLeaveCapture
                  variant="text"
                  color="red"
                  onClick={toggleTrashOpen}
                >
                  キャンセル
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
        <div className="mt-2">
          <CreateRootFolder />
        </div>
      </div>
      <div className="pb-4 pt-4 h-5/6">
        <div className="ml-6 text-gray-600 hover:text-gray-800 cursor-pointer">
          <Link
            to={`/root/note/journals/${todayX}`}
            onClick={onClickOpenJournal}
          >
            <div className="flex">
              <CalendarDaysIcon className="w-4 h-4" />
              <div className="ml-2 text-sm">Journals</div>
            </div>
          </Link>
        </div>
        <BookmarkList />
        <NoteTreeCompose />
      </div>
    </div>
  );
});

export default NoteTop;
