//JournalMention.tsx

import { createReactInlineContentSpec } from "@blocknote/react";
import { useState } from "react";
import {
  VscLink,
  VscFileSymlinkDirectory,
  VscFileSymlinkFile,
} from "react-icons/vsc";
import { IoMdMore } from "react-icons/io";
import { Tooltip } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { selectMentionBlock, setMentionBlock } from "@/slices/noteSlice";
import { useNavigate, useParams } from "react-router-dom";

// The Mention inline content.
export const JournalMention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props: any) => {
      const { ymday }: any = useParams();
      const navigate: any = useNavigate();
      const [cardStyle, setCardStyle] = useState("inline");
      const { open }: any = useAppSelector(selectMentionBlock);
      const dispatch = useAppDispatch();

      const onClickMention = (t: any) => {
        dispatch(
          setMentionBlock({
            open: t,
            mentionData: props.inlineContent.props.user.index,
            mentionType: props.inlineContent.props.user.type,
          })
        );
      };

      const getFolder = async () => {
        navigate(
          `/root/note/journals/${ymday}/${props.inlineContent.props.user.index}`
        );
      };
      const cardStyles = {
        inline: (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
            }}
            className="flex cursor-pointer p-1 rounded-md hover:bg-gray-100"
            onClick={() => getFolder()}
          >
            <VscFileSymlinkFile className="mr-[2px]" />
            {/* アイコンの右側に余白を追加 */}
            <span
              className="border-b-[2px]"
              onClick={() => onClickMention(!open)}
            >
              {props.inlineContent.props.user.title}
            </span>
          </span>
        ),
        card: (
          <div
            className="mt-4 cursor-pointer hover:bg-gray-100 max-w-full mx-auto bg-white border-gray-200 border rounded-lg overflow-hidden"
            onClick={() => getFolder()}
          >
            <div className="relative">
              <div className="text-start px-2 py-2">
                <div className="">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className=" flex p-1 rounded-md "
                  >
                    <VscFileSymlinkFile className="mr-2 text-gray-500" />
                    {/* アイコンの右側に余白を追加 */}
                    <span
                      className=" font-bold text-gray-600"
                      onClick={() => onClickMention(!open)}
                    >
                      {props.inlineContent.props.user.title}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ),
        cardDetail: "",
      };

      return (
        <>
          <span className="group">
            <span className=" -mt-5 group-hover:[transform:perspective(0px)_translateZ(0)_rotateX(0deg)] bg-white absolute transform rounded text-blue-gray opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className=" shadow-xl flex gap-1 ">
                <Tooltip content="open">
                  <div className="cursor-pointer hover:bg-gray-100 rounded p-2 border-r-2 text-xs text-center">
                    <VscFileSymlinkFile
                      className=" w-4 h-4"
                      onClick={() => getFolder()}
                    />
                  </div>
                </Tooltip>
                <Tooltip content="inline">
                  <div className="cursor-pointer hover:bg-gray-100 rounded p-2 text-xs text-center">
                    <VscLink
                      className=" w-4 h-4 "
                      onClick={() => setCardStyle("inline")}
                    />
                  </div>
                </Tooltip>
                <Tooltip content="card">
                  <div
                    className="cursor-pointer hover:bg-gray-100 rounded p-2 border-r-2 text-xs text-center"
                    onClick={() => setCardStyle("card")}
                  >
                    <VscFileSymlinkDirectory className=" w-4 h-4" />
                  </div>
                </Tooltip>
                <div className="cursor-pointer hover:bg-gray-100 rounded p-2 text-xs text-center">
                  <IoMdMore className=" w-4 h-4" />
                </div>
              </div>
            </span>
            {cardStyle == "inline" ? (
              <>{cardStyles.inline}</>
            ) : (
              <>{cardStyles.card}</>
            )}
          </span>
        </>
      );
    },
  }
);
