//BlockQuote.tsx

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Box, Divider, MantineProvider, Spoiler } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const BlockQuote = createReactBlockSpec(
  {
    type: "blockquote",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "blockquote",
        values: ["blockquote"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <MantineProvider>
          <blockquote className="w-full py-2 px-4 my-1 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            <div className=" text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">
              <div className={"inline-content"} ref={props.contentRef} />
            </div>
          </blockquote>
        </MantineProvider>
      );
    },
  }
);

// BlockDivider コンポーネント
// ユーザーが線の太さ、色、スタイルを設定できるようにしています
export const BlockDivider = createReactBlockSpec(
  {
    type: "prodivider",
    propSchema: {
      // Divider の太さ（ピクセル値）
      thickness: {
        default: 2,
        type: "number",
      },
      // Divider の色（Mantine のテーマカラー名など、または CSS カラーコード）
      color: {
        default: "gray",
        type: "string",
      },
      // 線のスタイル：solid（実線）、dotted（点線）、dashed（破線）
      variant: {
        default: "solid",
        values: ["solid", "dotted", "dashed"],
      },
      type: {
        default: "prodivider",
        values: ["prodivider"],
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <MantineProvider>
          <Divider
            my="md"
            size="sm"
            style={{ width: "100%" }}
            variant="dashed"
          />
        </MantineProvider>
      );
    },
  }
);

// The Collapsible block.
export const CollapsibleBlock = createReactBlockSpec(
  {
    type: "collapse",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: false,
        values: [true, false],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const [opened, { toggle }] = useDisclosure(props.block.props.type);

      return (
        <MantineProvider>
          <Box
            maw={720}
            className="w-full shadow-md p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          >
            <Spoiler
              className="w-full"
              onClick={() => {
                toggle();
                props.editor.updateBlock(props.block, {
                  type: "collapse",
                  props: { type: !opened },
                });
              }}
              maxHeight={100}
              showLabel="さらに続ける"
              hideLabel="隠す"
            >
              <div className="inline-content" ref={props.contentRef} />
            </Spoiler>
          </Box>
        </MantineProvider>
      );
    },
  }
);
