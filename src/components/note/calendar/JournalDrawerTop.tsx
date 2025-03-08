//JournalDrawerTop.tsx

import { memo, useEffect } from "react";
import { JournalDrawerEditor } from "./JournalDrawerEditor";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "@/components/atoms/fetch/Loding";
import { Error } from "@/components/atoms/fetch/Error";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { selectMentionBlock, setMentionBlock } from "@/slices/noteSlice";
import { Rnd } from "react-rnd";

export const JournalDrawerTop = memo(() => {
  const dispatch = useAppDispatch();
  const { ymday }: any = useParams();
  const navigate = useNavigate();
  const mentionOpen: any = useAppSelector(selectMentionBlock);
  const { data, status, refetch }: any = useQueryFolderBlocks(
    mentionOpen.mentionData
  );

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

  const onClickMention = () => {
    localStorage.removeItem("mentionContent");
    navigate(`/root/note/journals/${ymday}`);
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  if (mentionOpen.open === false)
    return (
      <div className=" ml-[800px] w-[300px]">
        <DefaultSkeleton />
      </div>
    );

  return (
    <div className=" bg-white overflow-y-auto hover-scrollbar">
      {
        <Rnd
          default={{
            x: 840,
            y: 10,
            width: 350,
            height: 600,
          }}
          className=" shadow-xl bg-white overflow-y-auto hover-scrollbar"
          minWidth={350}
          minHeight={190}
          bounds="window"
        >
          <div className=" relative">
            <div
              className=" absolute right-4 top-4 cursor-pointer opacity-10 hover:opacity-50"
              onClick={() => onClickMention()}
            >
              ❌
            </div>
          </div>
          <JournalDrawerEditor initialContent={data?.docs[0].contents} />
        </Rnd>
      }
    </div>
  );
});
