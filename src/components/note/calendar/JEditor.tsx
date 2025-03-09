//JEditor.tsx

import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  // uploadToTmpFilesDotOrg_DEV_ONLY,
  locales,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Alert } from "../Alert";
import { useAppDispatch } from "@/libs/app/hooks";
import { resetCodeState, setAddCodeState } from "@/slices/noteSlice";
import { JournalMention } from "./JournalMention";
import { PDF } from "../PDF";
import { BlockDivider, BlockQuote, CollapsibleBlock } from "../BlockQuote";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowConversionExtension,
  DableLeftConversionExtension,
  DableRightConversionExtension,
} from "../utils/ArrowConversionExtension";
import CharacterCount from "@tiptap/extension-character-count";
import { formatHTML } from "../utils/formatHTML";
import { DiffNoteViewr } from "../DiffNoteViewr";
import { useParams } from "react-router-dom";
import { BaseEditor } from "../utils/BaseEditor";
import { AccordionComponent } from "../utils/Accordion";
import {
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";
import { saveFileLocally } from "../utils/saveFileLocally";

const limit = 10000;
// アイコンのアニメーションバリアント

export const JEditor = ({ initialContent, result, setCodeItem }: any) => {
  const dispatch = useAppDispatch();
  const [openDiff, setOpenDiff] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const { mentionId }: any = useParams();

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

  const [charCount, setCharCount] = useState(
    editor._tiptapEditor.storage.characterCount.characters()
  );

  const onChange = async () => {
    if (editor) {
      localStorage.setItem("editorContent", JSON.stringify(editor.document));
      const html: any = await editor.blocksToHTMLLossy(editor.document);
      setCodeItem({
        id: "",
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
    <div>
      <div className="-mt-32 text-blue-gray-400">
        <AccordionComponent
          editor={editor}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          mentionId={mentionId}
          result={result}
          charCount={charCount}
          openDiff={openDiff}
          setOpenDiff={setOpenDiff}
          openAccordion="journals"
        />
      </div>
      <div className=" mt-8">
        {openDiff ? (
          <div className=" -ml-80">
            <DiffNoteViewr />
          </div>
        ) : (
          <BaseEditor editor={editor} onChange={onChange} />
        )}
      </div>
    </div>
  );
};
