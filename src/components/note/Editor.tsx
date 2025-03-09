//Editor.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BlockNoteSchema,
  // uploadToTmpFilesDotOrg_DEV_ONLY,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  locales,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetCodeState,
  selectComplexAllFolder,
  selectTitleId,
  setAddCodeState,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import EmojiPicker from "../modals/note/EmojiPicker";
import { Alert } from "./Alert";
import { Mention } from "./Mention";
import { PDF } from "./PDF";
import { motion } from "framer-motion";
import {
  ArrowConversionExtension,
  DableLeftConversionExtension,
  DableRightConversionExtension,
} from "./utils/ArrowConversionExtension";
import { BlockDivider, BlockQuote, CollapsibleBlock } from "./BlockQuote";
import CharacterCount from "@tiptap/extension-character-count";
import { DiffNoteViewr } from "./DiffNoteViewr";
import { formatHTML } from "./utils/formatHTML";
import { AccordionComponent } from "./utils/Accordion";
import { convertToIndexTitles } from "./utils/convertToIndexTItle";
import { journalItem, notJournalItem } from "./utils/notJournalItem";
import { BaseEditor } from "./utils/BaseEditor";
import {
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";
import { saveFileLocally } from "./utils/saveFileLocally";

const limit = 20000;

function Editor({ initialContent, result, setCodeItem }: any) {
  const dispatch = useAppDispatch();
  const [openDiff, setOpenDiff] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { noteId, mentionId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);
  const i: any = useAppSelector(selectComplexAllFolder);
  const updatedDay: any | null = localStorage.getItem("editorContentUpdated");
  const inputDateTime: any = new Date(JSON.parse(updatedDay));
  const dataToString = useCallback(() => {
    // 年、月、日、時間、分、秒を取得
    const year = inputDateTime.getFullYear();
    const month = String(inputDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(inputDateTime.getDate()).padStart(2, "0");
    const hours = String(inputDateTime.getHours()).padStart(2, "0");
    const minutes = String(inputDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(inputDateTime.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }, [inputDateTime]);

  const timer = useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote, updateTreeIcon }: any = useMutateFolderBlocks();

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
    [i, noteId, updateTreeNote, titleId]
  );

  const onIconChange = useCallback(
    (newIcon: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [noteId]: {
            ...i[noteId],
            data: {
              ...i[noteId].data,
              icon: newIcon,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeIcon.mutate({ index: titleId.index, data: newIcon });
      }, 500);
    },
    [i, noteId, updateTreeIcon, titleId]
  );

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
            mention: Mention,
          },
        })
      ),
    []
  );

  const initialContentParsed = useMemo(() => {
    try {
      return initialContent ? JSON.parse(initialContent) : undefined; // 空の場合は空のオブジェクト
    } catch (error) {
      console.error("Error parsing initial content:", error);
      return undefined; // エラーが発生した場合は空のオブジェクトを返す
    }
  }, [initialContent]);

  const editor = useCreateBlockNote(
    {
      schema,
      tables: {
        splitCells: true,
        cellBackgroundColor: true,
        cellTextColor: true,
        headers: true,
      },
      initialContent: initialContentParsed,
      uploadFile: saveFileLocally,
      _tiptapOptions: {
        extensions: [
          ArrowConversionExtension,
          DableRightConversionExtension,
          DableLeftConversionExtension,
          CharacterCount.configure({
            limit,
          }),
        ],
      },
      dropCursor: multiColumnDropCursor,
      dictionary: { ...locales.ja, multi_column: multiColumnLocales.ja },
    },
    []
  );

  const mentionLists = useMemo(
    () =>
      isChecked
        ? convertToIndexTitles(journalItem(i))
        : convertToIndexTitles(notJournalItem(i)),
    [i, isChecked]
  );

  // 追加: キャラクターカウントとワードカウントの状態管理
  const [charCount, setCharCount] = useState(
    editor._tiptapEditor.storage.characterCount.characters()
  );

  const onChange = async () => {
    if (editor) {
      localStorage.setItem("editorContent", JSON.stringify(editor.document));
      const html: any = await editor.blocksToHTMLLossy(editor.document);
      setCodeItem({
        id: dataToString(),
        code: formatHTML(html),
        language: "html",
      });
      if (editor._tiptapEditor) {
        setCharCount(editor._tiptapEditor.storage.characterCount.characters());
      }
    }
  };

  useEffect(() => {
    dispatch(resetCodeState());
    const fetchData = async () => {
      if (editor) {
        const html = await editor.blocksToHTMLLossy(editor.document);
        dispatch(
          setAddCodeState({
            id: "initial",
            code: formatHTML(html),
            language: "html",
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="hover-scrollbar overflow-y-auto overflow-x-hidden appearance-none mt-4 block rounded-lg p-4 text-xl focus:outline-none">
        <div>
          <div>
            <div className=" absolute -ml-3 top-20">
              <EmojiPicker
                icon={i[noteId].data.icon}
                onChange={onIconChange}
                sideItem={mentionId}
              />
            </div>
            <AccordionComponent
              editor={editor}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              mentionId={mentionId}
              result={result}
              charCount={charCount}
              openDiff={openDiff}
              setOpenDiff={setOpenDiff}
              openAccordion="note"
            />
          </div>
          <motion.div
            className="relative w-full flex"
            initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in initial state
            animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in animate state
            exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in exit state
            transition={{ duration: 0.5 }} // Animation duration
          >
            <div
              className="invisible min-h-[3.2em] overflow-x-hidden whitespace-pre-wrap break-words p-3"
              aria-hidden={true}
            />
            <input
              className="absolute text-4xl font-bold top-3 w-full h-full resize-none p-3 border-none outline-none select-auto"
              value={i[noteId].data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="無題"
            />
          </motion.div>
        </div>
      </div>
      <>
        {openDiff ? (
          <div className=" -ml-72">
            <DiffNoteViewr />
          </div>
        ) : (
          <motion.div
            className={
              mentionId ? `max-w-4xl h-full mt-4` : `max-w-4xl h-full mt-4`
            }
            initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in initial state
            animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in animate state
            exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in exit state
            transition={{ duration: 0.5 }} // Animation duration
          >
            <BaseEditor
              editor={editor}
              onChange={onChange}
              isChecked={isChecked}
            />
          </motion.div>
        )}
      </>
    </>
  );
}

export default Editor;
