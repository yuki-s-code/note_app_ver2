// Note.tsx

import NoteTop from "./NoteTop";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import {
  resetSearchName,
  selectComplexFolder,
  setComplexAllFolder,
  setComplexFolder,
  setNoteBlocks,
  setTreeIdGet,
} from "../../slices/noteSlice";
import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useQueryTreeFolder } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { Message } from "./Message";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import uid from "@/libs/utils/uid";
import { FcDataSheet, FcFile, FcFolder } from "react-icons/fc";
import { Button } from "@material-tailwind/react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const Note = memo(() => {
  const dispatch = useAppDispatch();
  const { noteId, ymday } = useParams<{ noteId?: string; ymday?: string }>();
  const { data, status, refetch }: any = useQueryTreeFolder();
  const [showSidebar, setShowSidebar] = useState(true);
  const sidebarVariants = {
    open: { width: 240, transition: { type: "tween", duration: 0.5 } },
    closed: { width: 0, transition: { type: "tween", duration: 0.5 } },
  };

  const toggleSidebar = useCallback(() => {
    setShowSidebar((prev) => !prev);
  }, []);

  useEffect(() => {
    refetch();
    if (data?.docs.length) {
      dispatch(setComplexAllFolder(data.updatedTreeItems));
    }
  }, [data, dispatch, noteId, ymday]);

  const items = useAppSelector(selectComplexFolder);
  const { addRootCreateFolder, addRootCreateNote } = useMutateFolderBlocks();

  const submitItemHandler = useCallback(
    (isFolder: boolean, dataType: string) => {
      const uuidValue = uid();
      const newItem = {
        index: uuidValue,
        canMove: true,
        isFolder,
        children: [],
        data: {
          title: "無題",
          icon: isFolder ? "📓" : "📝",
          image: "",
          type: dataType,
        },
        canRename: true,
        roots: true,
        bookmarks: [],
      };
      dispatch(setComplexFolder(newItem));
      dispatch(resetSearchName());

      const payload: any = { items, uuid: uuidValue, type: dataType };
      if (isFolder) {
        addRootCreateFolder.mutate(payload);
      } else {
        addRootCreateNote.mutate(payload);
      }
      dispatch(setTreeIdGet({ id: uuidValue }));
      dispatch(
        setNoteBlocks({
          id: uuidValue,
          contents: {},
          pageLinks: [],
          user: "all",
        })
      );
    },
    [dispatch, addRootCreateFolder, addRootCreateNote, items]
  );

  const submitFolderHandler = useCallback(
    () => submitItemHandler(true, "folder"),
    [submitItemHandler]
  );
  const submitNoteHandler = useCallback(
    () => submitItemHandler(false, "note"),
    [submitItemHandler]
  );
  const submitSheetHandler = useCallback(
    () => submitItemHandler(false, "sheet"),
    [submitItemHandler]
  );

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div>
      <div className="absolute left-20 top-2">
        <div
          onClick={toggleSidebar}
          className="absolute p-3 rounded-full text-gray-500 bg-gray-100 opacity-40 hover:opacity-80 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {showSidebar ? <HiChevronDoubleLeft /> : <HiChevronDoubleRight />}
        </div>
      </div>
      <div className="flex">
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <NoteTop />
            </motion.div>
          )}
        </AnimatePresence>

        {noteId || ymday ? (
          <div className="-mt-8 w-full pl-32 pr-16">
            <Outlet />
          </div>
        ) : (
          <div className="mt-20 w-full -ml-20">
            <Message />
            <div className="mt-8 flex items-center justify-center gap-4 opacity-90">
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitFolderHandler}
                className="flex items-center gap-3"
              >
                <FcFolder className="w-6 h-6" />
                新規フォルダー
              </Button>
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitNoteHandler}
                className="flex items-center gap-3"
              >
                <FcFile className="w-6 h-6" />
                新規ノート
              </Button>
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitSheetHandler}
                className="flex items-center gap-3"
              >
                <FcDataSheet className="w-6 h-6" />
                新規データシート
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Note;
