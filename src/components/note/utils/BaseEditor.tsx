// src/components/common/BaseEditor.tsx
import React, { useCallback, useMemo } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockTypeSelectItem,
  blockTypeSelectItems,
  DefaultReactSuggestionItem,
  DragHandleButton,
  FormattingToolbar,
  FormattingToolbarController,
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
} from "@blocknote/react";
import {
  filterSuggestionItems,
  BlockNoteEditor,
  combineByGroup,
} from "@blocknote/core";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import { RiAlertFill, RiDoubleQuotesL } from "react-icons/ri";
import { RemoveBlockButton } from "./RemoveBlockButton";
import { getMultiColumnSlashMenuItems } from "@blocknote/xl-multi-column";
import { convertToIndexTitles } from "./convertToIndexTItle";
import { journalItem, notJournalItem } from "./notJournalItem";
import { useAppSelector } from "@/libs/app/hooks";
import { selectComplexAllFolder } from "@/slices/noteSlice";
import {
  insertAlert,
  insertBlockQuote,
  insertCollapse,
  insertDivider,
  insertPDF,
  insertTimeItem,
  insertTodayItem,
  insertTomorrowItem,
  insertYesterDayItem,
} from "../insert/InsertCustumItem";

export const BaseEditor = ({ editor, onChange, isChecked }: any) => {
  const i: any = useAppSelector(selectComplexAllFolder);
  const getCustomSlashMenuItems = useCallback(
    (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => [
      //@ts-ignore
      ...getDefaultReactSlashMenuItems(editor),
      insertTodayItem(editor),
      insertTomorrowItem(editor),
      insertYesterDayItem(editor),
      insertTimeItem(editor),
      insertAlert(editor),
      insertBlockQuote(editor),
      insertCollapse(editor),
      insertPDF(editor),
      insertDivider(editor),
    ],
    []
  );
  const mentionLists = useMemo(
    () =>
      isChecked
        ? convertToIndexTitles(journalItem(i))
        : convertToIndexTitles(notJournalItem(i)),
    [i, isChecked]
  );
  const getMentionMenuItems = useCallback(
    (editor: any): DefaultReactSuggestionItem[] => {
      return mentionLists.map((user: any) => ({
        title: user.title,
        onItemClick: () => {
          editor.insertInlineContent([
            {
              type: "mention",
              props: {
                user,
              },
            },
            " ", // add a space after the mention
          ]);
        },
      }));
    },
    [mentionLists]
  );
  return (
    <>
      <BlockNoteView
        editor={editor}
        onChange={onChange}
        theme={"light"}
        slashMenu={false}
        formattingToolbar={false}
        sideMenu={false}
      >
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar
              blockTypeSelectItems={[
                ...blockTypeSelectItems(editor.dictionary),
                {
                  name: "注目",
                  type: "alert",
                  icon: RiAlertFill,
                  isSelected: (block: any) => block.type === "alert",
                } satisfies BlockTypeSelectItem,
                {
                  name: "引用",
                  type: "blockquote",
                  icon: RiDoubleQuotesL,
                  isSelected: (block: any) => block.type === "blockquote",
                } satisfies BlockTypeSelectItem,
              ]}
            />
          )}
        />
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu {...props}>
              {/* Button which removes the hovered block. */}
              <RemoveBlockButton {...props} />
              <DragHandleButton {...props} />
            </SideMenu>
          )}
        />
        <SuggestionMenuController
          triggerCharacter={"/"}
          // Replaces the default Slash Menu items with our custom ones.
          getItems={async (query) =>
            //@ts-ignore
            filterSuggestionItems(
              combineByGroup(
                //@ts-ignore
                getCustomSlashMenuItems(editor),
                getMultiColumnSlashMenuItems(editor)
              ),
              query
            )
          }
        />
        <SuggestionMenuController
          triggerCharacter={"@"}
          getItems={async (query) =>
            // Gets the mentions menu items
            filterSuggestionItems(getMentionMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </>
  );
};
