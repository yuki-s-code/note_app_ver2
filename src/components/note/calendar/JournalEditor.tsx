// JournalEditor.tsx

import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import useSaveKey from "@/libs/utils/useSaveKey";
import {
  resetSearchName,
  selectComplexAllFolder,
  selectComplexFolder,
  selectLiveBlock,
  setAddCodeState,
  setComplexFolder,
  setLiveBlock,
  setNoteBlocks,
  setTreeIdGet,
} from "@/slices/noteSlice";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { JEditor } from "./JEditor";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { extractMentionedUsers } from "../utils/getData";
import { useQueryFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "@/components/atoms/fetch/Loding"; // タイポ修正
import { Error } from "@/components/atoms/fetch/Error";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // react-hot-toast をインポート
import SuccessToast from "@/components/atoms/toast/SuccessToast";
import ErrorToast from "@/components/atoms/toast/ErrorToast";
import { CODESTATEITEM } from "@/libs/types/note";
import { format } from "date-fns";

export const JournalEditor = memo(({ openRight }: any) => {
  const dispatch = useAppDispatch();
  const ic: any = useAppSelector(selectComplexAllFolder);
  const { open } = useAppSelector(selectLiveBlock);
  const { ymday, mentionId }: any = useParams();
  const items: any = useAppSelector(selectComplexFolder);
  const [codeItem, setCodeItem]: any = useState<CODESTATEITEM>();
  const { data, status, refetch }: any = useQueryFolderBlocks(ymday);
  const pageLink: any | null = localStorage.getItem("editorPageLinks");
  const pageLinkObject = pageLink == null ? [] : JSON.parse(pageLink);

  const result = useMemo(() => {
    return Array.from(pageLinkObject)
      .filter((key: any) => ic.hasOwnProperty(key))
      .map((key: any) => ic[key]);
  }, [pageLinkObject, ic]);

  const { addJournalsDataMutation }: any = useMutateFolderBlocks();

  useEffect(() => {
    refetch();
    // const editorStr: any =
    //   data && data.docs.length ? data?.docs[0].contents : "";
    // localStorage.setItem("editorContent", JSON.stringify(editorStr));
    dispatch(
      setLiveBlock({
        open: false,
      })
    );
    setTimeout(() => {
      dispatch(
        setLiveBlock({
          open: true,
        })
      );
    }, 300);
  }, [ymday]);

  const previousMention: any = useMemo(() => {
    return extractMentionedUsers(
      data && data.docs.length ? data?.docs[0].contents : ""
    );
  }, [data]);

  const submitItemHandler = useCallback(
    (isFolder: any, dataType: any) => {
      const initial = JSON.parse(localStorage.getItem("editorContent") || "");
      const nowMention = extractMentionedUsers(initial);

      // Use sets for efficient difference calculation
      const prevMentionSet = new Set(
        previousMention?.map((item: any) => item.index) || []
      );
      const nowMentionSet = new Set(
        nowMention.map((item: any) => item.index) || []
      );

      const pageLinksChanges = {
        added: nowMention
          .filter((item: any) => !prevMentionSet.has(item.index))
          .map((item: any) => item.index),
        removed: previousMention
          .filter((item: any) => !nowMentionSet.has(item.index))
          .map((item: any) => item.index),
        unchanged: nowMention
          .filter((item: any) => prevMentionSet.has(item.index))
          .map((item: any) => item.index),
      };
      dispatch(
        setComplexFolder({
          index: ymday,
          canMove: true,
          isFolder: isFolder,
          children: [],
          data: {
            title: ymday,
            icon: "📝",
            image: "",
            type: dataType,
          },
          canRename: true,
          roots: true,
          bookmarks: [],
        })
      );
      dispatch(resetSearchName());
      addJournalsDataMutation.mutate(
        {
          items,
          uuid: ymday,
          type: dataType,
          journalData: initial,
          pageLinks: pageLinksChanges,
        },
        {
          onSuccess: () => {
            toast.custom((t) => <SuccessToast message="保存成功しました" />, {
              duration: 3000,
              position: "top-right",
            });
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              error.message ||
              "保存に失敗しました";
            toast.custom(
              (t) => (
                <ErrorToast message={`保存に失敗しました: ${errorMessage}`} />
              ),
              {
                duration: 5000,
                position: "top-right",
              }
            );
          },
        }
      );
      dispatch(
        setTreeIdGet({
          id: ymday,
        })
      );
      dispatch(
        setNoteBlocks({
          id: ymday,
          contents: initial,
          pageLinks: pageLink == null ? [] : JSON.parse(pageLink),
          user: "all",
        })
      );
      dispatch(setAddCodeState(codeItem));
    },
    [dispatch, addJournalsDataMutation, items, previousMention, ymday, pageLink]
  );

  const onClickSave = () => {
    submitItemHandler(false, "journals");
  };

  useSaveKey(() => onClickSave());

  if (status === "loading") return <Loding />; // タイポ修正
  if (status === "error") return <Error />;
  if (open === false)
    return (
      <div className="">
        <DefaultSkeleton />
      </div>
    );
  if (status === "success")
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in initial state
        animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in animate state
        exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in exit state
        transition={{ duration: 0.5 }} // Animation duration
      >
        <div className=" mt-16 flex text-blue-gray-400 select-none">
          <div className="text-5xl ">{ymday}</div>
          <div className=" ml-4 text-xl mt-5">{format(ymday, "EEE")}</div>
        </div>

        <div
          className={
            openRight || mentionId
              ? `mt-8 h-full max-w-3xl`
              : `mt-8 h-full max-w-4xl`
          }
        >
          <JEditor
            initialContent={data?.docs.length ? data?.docs[0].contents : ""}
            result={result}
            setCodeItem={setCodeItem}
          />
        </div>
      </motion.div>
    );
  return null;
});

export default JournalEditor;
