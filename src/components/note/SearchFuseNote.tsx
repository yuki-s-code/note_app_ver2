// SearchFuseNote.tsx

import React, { useCallback, useEffect } from "react";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { useAppDispatch } from "@/libs/app/hooks";
import {
  resetCreateFolderModal,
  resetNoteBlocks,
  setCreateFolderModal,
  setItemIndex,
  setTitleId,
} from "@/slices/noteSlice";
import { Link } from "react-router-dom";
import { highlightText } from "./utils/highlightText";
import { SearchResult } from "@/libs/types/note";
import { useSearchFolders } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "./utils/useDebounce";
import axios from "axios";

interface SearchFuseNoteProps {
  searchText: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const SearchFuseNote: React.FC<SearchFuseNoteProps> = ({
  searchText,
  setOpen,
}) => {
  const dispatch = useAppDispatch();
  const limit = 20; // ページあたり表示件数を 20 に設定
  const debouncedSearchText = useDebounce(searchText, 300); // 300ms デバウンス

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useSearchFolders(debouncedSearchText, limit);
  // フラットな結果配列

  const results: SearchResult[] = data
    ? data.pages.flatMap((page) => page.results)
    : [];
  console.log(results);
  // ローディングとエラーステート
  const isInitialLoading = isFetching && !isFetchingNextPage && !data;
  const isError = error;

  // インターセクションオブザーバーのフック
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1, // 10% 可視化でトリガー
    triggerOnce: false,
  });

  // inView が true になったら次のページをフェッチ
  useEffect(() => {
    console.log("inView:", inView);
    console.log("hasNextPage:", hasNextPage);
    console.log("isFetchingNextPage:", isFetchingNextPage);
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ハンドラー
  const onClickCreateFolderModal = useCallback(
    (n: any, m: SearchResult) => {
      dispatch(resetNoteBlocks());
      dispatch(
        setTitleId({
          index: m.id,
          dataItem: m.title,
          dataIcon: m.icon,
          dataImage: m.image,
          dataType: m.type,
        })
      );
      dispatch(
        setItemIndex({
          index: m.id,
        })
      );
      dispatch(
        setCreateFolderModal({
          open: n,
        })
      );
    },
    [dispatch]
  );

  const getData = useCallback(async (m: string) => {
    const apiUrl = "http://localhost:8088/notes";
    try {
      const response = await axios.get(`${apiUrl}/get_folder`, {
        params: { id: m },
      });
      const data_item = response.data.docs[0]?.contents || "";
      localStorage.setItem("editorContent", JSON.stringify(data_item));
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.setItem("editorContent", JSON.stringify(""));
    }
  }, []);

  const modalOpenHandler = useCallback(() => {
    dispatch(resetCreateFolderModal());
  }, [dispatch]);

  if (isInitialLoading) return <Loding />;
  if (isError) return <Error />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {results.map((item: any) => (
          <Link key={item.id} to={`/root/note/${item.id}`}>
            <div
              className="py-2 px-2 text-sm text-gray-700 border-b opacity-70 hover:opacity-100 hover:bg-gray-200 cursor-pointer"
              onClick={async () => {
                onClickCreateFolderModal(2, item);
                await getData(item.id);
                modalOpenHandler();
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="font-bold">{item.icon || "📄"}</div>
                <div className="font-bold pl-2 flex-grow">
                  {highlightText(item.title, searchText)}
                </div>
                <div className="text-xs pl-4">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : ""}
                </div>
              </div>
              <div className="py-2 ml-5 line-clamp-3">
                {typeof item.searchableContents === "string" ? (
                  highlightText(item.searchableContents, searchText)
                ) : (
                  <span>{JSON.stringify(item.searchableContents)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
        {/* セントネル要素 */}
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center"
        >
          {isFetchingNextPage ? (
            <Loding />
          ) : hasNextPage ? (
            <span>さらに読み込む...</span>
          ) : (
            <div className="text-center text-gray-500 mt-4">
              これ以上表示する項目はありません。
            </div>
          )}
        </div>
        {/* 空の検索結果表示 */}
        {!isInitialLoading && results.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            検索結果が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
};
