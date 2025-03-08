import React, { useCallback, useEffect, useState } from "react";
import { ToggleLeftIcon, ToggleRightIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  selectMentionBlock,
  selectTitleId,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import DrawerSheet from "./DrawerSheet";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { useParams } from "react-router-dom";

export default function DrawerSheetTop() {
  const dispatch = useAppDispatch();
  const initialContent: any | null = localStorage.getItem("mentionContent");
  const { mentionId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);

  const i: any = useAppSelector(selectComplexAllFolder);
  const [read, setRead] = useState(false);

  const dataObject: any = JSON.parse(initialContent);

  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote }: any = useMutateFolderBlocks();

  const [open, setOpen]: any = useState(false);
  useEffect(() => {
    setOpen(false);
    setTimeout(() => {
      setOpen(true);
    }, 300);
  }, [mentionId]);

  const onTitleChange = useCallback(
    (t: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [mentionId]: {
            ...i[mentionId],
            data: {
              ...i[mentionId].data,
              title: t,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeNote.mutate({ index: mentionId, data: t });
      }, 500);
    },
    [i, mentionId, dispatch, updateTreeNote, titleId]
  );

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
                value={i[mentionId].data.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="無題"
              />
            </div>
          </div>

          <DrawerSheet
            height="90%"
            data={dataObject}
            noteId={mentionId}
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
