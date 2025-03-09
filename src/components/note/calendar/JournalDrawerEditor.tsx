//JournalDrawerEditor.tsx

import React, { useCallback, useMemo, useRef } from "react";
import {
  BlockNoteSchema,
  // uploadToTmpFilesDotOrg_DEV_ONLY,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  locales,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Alert } from "../Alert";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import EmojiPicker from "@/components/modals/note/EmojiPicker";
import { extractMentionedUsers } from "../utils/getData";
import { useParams } from "react-router-dom";
import { JournalMention } from "./JournalMention";
import { PDF } from "../PDF";
import {
  ArrowConversionExtension,
  DableLeftConversionExtension,
  DableRightConversionExtension,
} from "../utils/ArrowConversionExtension";
import { BlockDivider, BlockQuote, CollapsibleBlock } from "../BlockQuote";
import { BaseEditor } from "../utils/BaseEditor";
import {
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";
import { saveFileLocally } from "../utils/saveFileLocally";

export const JournalDrawerEditor = ({ initialContent }: any) => {
  const dispatch = useAppDispatch();
  const { mentionId }: any = useParams();
  const i: any = useAppSelector(selectComplexAllFolder);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote, updateTreeIcon, folderBlocksContentsMutation }: any =
    useMutateFolderBlocks();

  const pageLink: any | null = localStorage.getItem("editorPageLinks");
  const pageLinkObject = pageLink == null ? [] : JSON.parse(pageLink);

  const result: Record<string, any> = [];
  for (const key of pageLinkObject) {
    if (i.hasOwnProperty(key)) {
      result.push(i[key]);
    }
  }

  const previousMention: any = useMemo(() => {
    return initialContent?.length > 0 // initialContentがnullまたは空文字列でないか確認
      ? extractMentionedUsers(initialContent)
      : "";
  }, [initialContent]);

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
    [i, mentionId, updateTreeNote]
  );

  const onIconChange = useCallback(
    (newIcon: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [mentionId]: {
            ...i[mentionId],
            data: {
              ...i[mentionId].data,
              icon: newIcon,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeIcon.mutate({ index: mentionId, data: newIcon });
      }, 500);
    },
    [i, mentionId, updateTreeIcon]
  );

  const onChange = useCallback((i: any) => {
    localStorage.setItem("mentionContent", JSON.stringify(i));
    if (timer.current) {
      clearTimeout(timer.current);
    }
    const initial: any = localStorage.getItem("mentionContent");
    const nowMention: any = extractMentionedUsers(JSON.parse(initial));

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

    timer.current = setTimeout(() => {
      folderBlocksContentsMutation.mutate(
        {
          id: mentionId,
          contents: JSON.parse(initial),
          pageLinks: pageLinksChanges,
        },
        {
          onSuccess: () => {
            console.log("Save was success");
          },
          onError: (error: any) => {
            // エラーがオブジェクトの場合とメッセージが存在しない場合に対応
            const errorMessage =
              error?.response?.data?.message ||
              error.message ||
              "保存に失敗しました。";
            alert(`保存に失敗しました: ${errorMessage}`);
          },
        }
      );
    }, 500);
  }, []);

  const schema = useMemo(
    () =>
      withMultiColumn(
        BlockNoteSchema.create({
          blockSpecs: {
            ...defaultBlockSpecs,
            alert: Alert,
            blockquote: BlockQuote,
            pdf: PDF,
            collapse: CollapsibleBlock,
            prodivider: BlockDivider,
          },
          inlineContentSpecs: {
            ...defaultInlineContentSpecs,
            mention: JournalMention,
          },
        })
      ),
    []
  );

  const editor = useCreateBlockNote(
    {
      schema,
      tables: {
        splitCells: true,
        cellBackgroundColor: true,
        cellTextColor: true,
        headers: true,
      },
      initialContent: initialContent,
      uploadFile: saveFileLocally,
      _tiptapOptions: {
        extensions: [
          ArrowConversionExtension,
          DableRightConversionExtension,
          DableLeftConversionExtension,
        ],
      },
      dropCursor: multiColumnDropCursor,
      dictionary: { ...locales.ja, multi_column: multiColumnLocales.ja },
    },
    []
  );

  return (
    <>
      <div className="appearance-none mt-4 block w-full rounded-lg p-4 text-xl focus:outline-none">
        <>
          <EmojiPicker icon={i[mentionId].data.icon} onChange={onIconChange} />
          <div className="relative w-full flex mt-4">
            <div
              className="invisible min-h-[3.2em] overflow-x-hidden whitespace-pre-wrap break-words p-3"
              aria-hidden={true}
            />
            <textarea
              className="absolute text-2xl font-bold top-0 w-full h-full resize-none p-3 border-none outline-none"
              value={i[mentionId].data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="無題"
            />
          </div>
        </>
      </div>
      <div>
        <BaseEditor
          editor={editor}
          onChange={() => onChange(editor.document)}
        />
      </div>
    </>
  );
};
