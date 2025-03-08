// LiveBlock.tsx

"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "./Editor";
import { DefaultSkeleton } from "../atoms/fetch/DefaultSkeleton";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  selectLiveBlock,
  selectTitleId,
  setAddCodeState,
  setComplexAllFolder,
  setItemIndex,
  setLiveBlock,
  setTitleId,
} from "@/slices/noteSlice";
import { Breadcrumbs, Tooltip } from "@material-tailwind/react";
import useSaveKey from "@/libs/utils/useSaveKey";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import { truncateText } from "./utils/truncateText";
import { extractMentionedUsers, getData } from "./utils/getData";
import {
  ArrowLeftRightIcon,
  BookmarkIcon,
  FileIcon,
  FolderIcon,
} from "lucide-react";
import toast from "react-hot-toast"; // headless を除去
import SuccessToast from "../atoms/toast/SuccessToast"; // パスを修正
import ErrorToast from "../atoms/toast/ErrorToast"; // パスを修正
import { motion } from "framer-motion";
import { CODESTATEITEM } from "@/libs/types/note";
import { useQueryFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";

export default function LiveBlock() {
  const dispatch = useAppDispatch();
  const ic: any = useAppSelector(selectComplexAllFolder);
  const [codeItem, setCodeItem]: any = useState<CODESTATEITEM>();
  const { noteId }: any = useParams();
  const { data, status }: any = useQueryFolderBlocks(noteId);
  const titleId: any = useAppSelector(selectTitleId);
  const { open }: any = useAppSelector(selectLiveBlock);
  const [itemBre, setItemBre]: any = useState([]);
  const initialContent: any | null = localStorage.getItem("editorContent");

  const pageLink: any | null = localStorage.getItem("editorPageLinks");

  const pageLinkObject: any =
    pageLink == null ? [] : new Set(JSON.parse(pageLink));

  const result = useMemo(() => {
    return Array.from(pageLinkObject)
      .filter((key: any) => ic.hasOwnProperty(key))
      .map((key: any) => ic[key]);
  }, [pageLinkObject, ic]);

  const componentRef: any = useRef(null);

  const previousMention: any = useMemo(() => {
    return extractMentionedUsers(
      data && data.docs.length ? data?.docs[0].contents : ""
    );
  }, [data]);

  const {
    folderBlocksContentsMutation,
    updateTreeBookmarked,
    updateTreeType,
  }: any = useMutateFolderBlocks();

  const userId = window.localStorage.sns_id;

  const onClickSave = useCallback(() => {
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
    console.log(noteId, initial, pageLinksChanges);
    folderBlocksContentsMutation.mutate(
      {
        id: noteId,
        contents: initial,
        pageLinks: pageLinksChanges,
      },
      {
        onSuccess: () => {
          toast.custom((t) => <SuccessToast message="保存に成功しました。" />, {
            duration: 3000,
            position: "top-right",
          });
        },
        onError: (error: any) => {
          // エラーがオブジェクトの場合とメッセージが存在しない場合に対応
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "保存に失敗しました。";
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
    dispatch(setAddCodeState(codeItem));
  }, [folderBlocksContentsMutation, noteId, previousMention, pageLink]);

  useSaveKey(() => onClickSave());

  const timer = useRef<NodeJS.Timeout | null>(null);

  const onFileTypeChange = useCallback(() => {
    if (!noteId) return;
    const currentType = ic[noteId].data.type;
    const newType = currentType === "folder" ? "note" : "folder";

    dispatch(
      setComplexAllFolder({
        ...ic,
        [noteId]: {
          ...ic[noteId],
          data: {
            ...ic[noteId].data,
            type: newType,
          },
        },
      })
    );
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      updateTreeType.mutate({ index: titleId.index, data: newType });
    }, 500);
  }, [ic, noteId, dispatch, titleId.index, updateTreeType]);

  const parentIndexesWithData: any = useMemo(() => {
    let currentIndex = noteId;
    const results: any = [];
    while (true) {
      const parentIndex = Object.keys(ic).find((key) =>
        ic[key].children?.includes(currentIndex)
      );
      if (parentIndex) {
        results.push(ic[parentIndex]);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    return results.reverse();
  }, [noteId, ic]);

  useEffect(() => {
    setItemBre(parentIndexesWithData);

    dispatch(setLiveBlock({ open: false }));
    const timeoutId = setTimeout(() => {
      dispatch(setLiveBlock({ open: true }));
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [noteId]);

  const onClickTitled = useCallback(
    (m: any) => {
      dispatch(
        setTitleId({
          index: m.index,
          dataItem: m.data.title,
          dataIcon: m.data.icon,
          dataImage: m.data.image,
          dataType: m.data.type,
        })
      );
      dispatch(
        setItemIndex({
          index: m.index,
        })
      );
    },
    [dispatch]
  );

  const BookMarkChecked = useCallback(() => {
    if (!noteId) return;
    const isBookmarked = ic[noteId].bookmarks.includes(userId);
    updateTreeBookmarked.mutate({
      index: titleId.index,
      data: userId,
      trueToFalse: !isBookmarked,
    });
  }, [ic, noteId, userId, titleId.index, updateTreeBookmarked]);

  // アニメーションバリアントの定義
  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
    click: {
      scale: [1, 1.4, 1],
      rotate: [0, 20, -20, 0],
      transition: { duration: 0.6 },
    },
  };

  if (status === "loading") return <Loding />; // タイポ修正
  if (status === "error") return <Error />;

  const Checked = () => {
    const tf = noteId && ic[noteId].bookmarks.includes(userId);
    return (
      <Tooltip
        content={`${tf ? "ブックマーク済" : "ブックマークされてません"}`}
      >
        <motion.div
          className="relative cursor-pointer text-blue-gray-200"
          variants={iconVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => BookMarkChecked()}
          animate={tf ? "click" : "initial"}
        >
          <BookmarkIcon
            color={tf ? "#3e9392" : "#b0bec5"}
            className="h-7 w-7"
          />
        </motion.div>
      </Tooltip>
    );
  };

  return (
    <>
      {open ? (
        <div ref={componentRef} className="relative h-full flex flex-col">
          {/* Breadcrumbs を固定するために sticky を設定 */}
          <div className="flex sticky top-0 z-10 bg-white">
            <Breadcrumbs
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              className="mb-2"
              separator=">"
            >
              {itemBre.map((l: any, i: any) => (
                <div key={i} className="opacity-60">
                  {i === 0 ? (
                    <Link to={`/root/note`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      to={`/root/note/${l.index}`}
                      className="flex"
                      onClick={() => {
                        onClickTitled(l);
                        getData(l);
                      }}
                    >
                      <div>{truncateText(l.data.title, 8)}</div>
                    </Link>
                  )}
                </div>
              ))}
            </Breadcrumbs>
            <div className="p-2 mt-1 text-xs text-blue-gray-500">
              {truncateText(ic[noteId].data.title, 10)}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="w-full relative">
              <div className="flex">
                <div className="flex gap-2 mt-2 ml-2">
                  {/* プリンターアイコン */}
                  {/* <motion.div
                    className="p-1 rounded-xl cursor-pointer text-blue-gray-200 hover:text-blue-gray-400"
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {}}
                  >
                    <ReactToPrint
                      trigger={() => <PrinterIcon />}
                      content={() => componentRef.current}
                    />
                  </motion.div> */}
                  {/* ブックマークアイコン */}
                  <div className="relative">
                    <Checked />
                  </div>
                  {/* フォルダーとファイルの切り替えアイコン */}
                  <Tooltip content={"フォルダーとファイルを入れ替える"}>
                    <motion.div
                      className="flex text-blue-gray-200 gap-1 mt-1 cursor-pointer hover:text-blue-gray-400 ml-4 relative"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={onFileTypeChange}
                    >
                      <FolderIcon
                        color={
                          ic[noteId].data.type === "folder"
                            ? "#3e9392"
                            : "#b0bec5"
                        }
                      />
                      <ArrowLeftRightIcon size={12} className="mt-2" />
                      <FileIcon
                        color={
                          ic[noteId].data.type === "note"
                            ? "#3e9392"
                            : "#b0bec5"
                        }
                      />
                    </motion.div>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="h-full">
              <div className="relative z-0 w-full">
                <Editor
                  initialContent={initialContent}
                  result={result}
                  setCodeItem={setCodeItem}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-10/12">
          <DefaultSkeleton />
        </div>
      )}
    </>
  );
}
