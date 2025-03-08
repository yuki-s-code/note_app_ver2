import { memo, useCallback, useEffect } from "react";
import { VscLayoutSidebarRight, VscLayoutCentered } from "react-icons/vsc";
import { Rnd } from "react-rnd";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DrawerEditor } from "./DrawerEditor";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { useQueryFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "@/components/atoms/fetch/Loding";
import { Error } from "@/components/atoms/fetch/Error";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetPeekDisplayOpen,
  selectMentionBlock,
  selectPeekDisplay,
  setMentionBlock,
  setPeekDisplayOpen,
} from "@/slices/noteSlice";

export const DrawerTop = memo(() => {
  const dispatch = useAppDispatch();
  const { noteId }: any = useParams();
  const navigate = useNavigate();
  const { peekDisplay }: any = useAppSelector(selectPeekDisplay);
  const mentionOpen: any = useAppSelector(selectMentionBlock);
  console.log(mentionOpen);
  const { data, status, refetch }: any = useQueryFolderBlocks(
    mentionOpen.mentionData
  );
  console.log(data?.docs);

  useEffect(() => {
    refetch();
    dispatch(
      setMentionBlock({
        ...mentionOpen,
        open: false,
      })
    );
    setTimeout(() => {
      dispatch(
        setMentionBlock({
          ...mentionOpen,
          open: true,
        })
      );
    }, 300);
  }, [mentionOpen.mentionData]);

  if (mentionOpen.mentionData && !mentionOpen.open) {
    setTimeout(() => {
      dispatch(
        setMentionBlock({
          ...mentionOpen,
          open: true,
        })
      );
    }, 300);
  }

  const onClickMention = useCallback(() => {
    localStorage.removeItem("mentionContent");
    navigate(`/root/note/${noteId}`);
    dispatch(resetPeekDisplayOpen());
  }, []);

  const onClickPeek = useCallback((f: any) => {
    dispatch(
      setPeekDisplayOpen({
        peekDisplay: f,
      })
    );
  }, []);

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  if (mentionOpen.open === false)
    return (
      <div className="w-[350px]">
        <DefaultSkeleton />
      </div>
    );
  return (
    <>
      {!peekDisplay ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} // 初期状態: 非表示、少し縮小
          animate={{ opacity: 1, scale: 1 }} // アニメーション後: 表示、元のサイズ
          exit={{ opacity: 0, scale: 0.9 }} // コンポーネントが消える際のアニメーション
          transition={{ duration: 1 }} // アニメーション時間
        >
          <Rnd
            default={{
              x: 100,
              y: 48,
              width: 700,
              height: 500,
            }}
            className="hover-scrollbar shadow-xl bg-white overflow-y-auto opacity-95"
            minWidth={350}
            minHeight={190}
            bounds="window"
          >
            <DrawerEditor initialContent={data?.docs[0].contents} />
            <div className=" flex opacity-40">
              <VscLayoutSidebarRight
                className=" absolute left-4 top-5 cursor-pointer hover:opacity-50"
                onClick={() => onClickPeek(true)}
              />

              <div
                className=" absolute right-4 top-4 cursor-pointer hover:opacity-80"
                onClick={() => onClickMention()}
              >
                ❌
              </div>
            </div>
          </Rnd>
        </motion.div>
      ) : (
        <div className="hover-scrollbar -ml-8 bg-white overflow-y-auto shadow-xl resize-x min-h-[calc(100vh-5rem)]  min-w-[350px] max-w-[550px] ">
          <div>
            <div
              className="w-full"
              style={{
                maxHeight: "calc(100vh - 8rem)",
              }}
            >
              <DrawerEditor initialContent={data?.docs[0].contents} />
            </div>
            <div className=" flex">
              <VscLayoutCentered
                className=" absolute left-4 top-5 cursor-pointer opacity-10 hover:opacity-50"
                onClick={() => onClickPeek(false)}
              />

              <div
                className=" absolute right-4 top-4 cursor-pointer opacity-10 hover:opacity-50"
                onClick={() => onClickMention()}
              >
                ❌
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
