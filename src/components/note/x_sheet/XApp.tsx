import React, { useCallback, useEffect, useState } from "react";
import Spreadsheet from "./SpreadSheet";
import { ToggleLeftIcon, ToggleRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  selectTitleId,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";

export default function XApp() {
  const dispatch = useAppDispatch();
  const { noteId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);
  const i: any = useAppSelector(selectComplexAllFolder);
  const [read, setRead] = useState(false);
  const [open, setOpen]: any = useState(false);
  const data: any = localStorage.getItem("dataSheetContent");
  const dataObject: any = JSON.parse(data);
  console.log(dataObject);

  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote }: any = useMutateFolderBlocks();

  const onTitleChange = useCallback(
    (t: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [noteId]: {
            ...i[noteId],
            data: {
              ...i[noteId].data,
              title: t,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeNote.mutate({ index: titleId.index, data: t });
      }, 500);
    },
    [i, noteId, dispatch, updateTreeNote, titleId]
  );

  useEffect(() => {
    setOpen(false);
    setTimeout(() => {
      setOpen(true);
    }, 300);
  }, [noteId]);
  return (
    <>
      {open ? (
        <div style={{ height: "100vh" }}>
          <div className="flex text-gray-500">
            <button
              className="  hover:text-gray-700"
              onClick={() => setRead(!read)}
            >
              {read ? <ToggleRightIcon /> : <ToggleLeftIcon />}
            </button>
            <div className="relative w-full flex ml-8">
              <div
                className="invisible min-h-[3.2em] overflow-x-hidden whitespace-pre-wrap break-words p-3"
                aria-hidden={true}
              />
              <textarea
                className="absolute text-xl font-bold top-0 w-full h-full resize-none p-3 border-none outline-none"
                value={i[noteId].data.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="無題"
              />
            </div>
          </div>

          <Spreadsheet
            height="90%"
            data={dataObject}
            noteId={noteId}
            options={
              read && {
                mode: "read",
                showToolbar: false,
                showGrid: false,
                showContextmenu: false,
              }
            }
          />
          <br />
        </div>
      ) : (
        <DefaultSkeleton />
      )}
    </>
  );
}
