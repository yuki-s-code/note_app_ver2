//Mention.tsx

import { createReactInlineContentSpec } from "@blocknote/react";
import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { selectMentionBlock, setMentionBlock } from "@/slices/noteSlice";
import { useNavigate, useParams } from "react-router-dom";

// Tailwind でアイコンを作成
const iconClasses = {
  file: "inline-block w-4 h-4 bg-contain bg-no-repeat mr-1",
  link: "inline-block w-4 h-4 bg-contain bg-no-repeat",
  folder: "inline-block w-4 h-4 bg-contain bg-no-repeat",
  more: "inline-block w-4 h-4 bg-contain bg-no-repeat",
};

const iconStyles = {
  file: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='gray'%3E%3Cpath d='M4 1h7.293l3.707 3.707V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 1 1 1-1zm0 1v12h10V5H10V2H4zM6 7v1h4V7H6zm0 2v1h6V9H6z'/%3E%3C/svg%3E")`,
  },
  link: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='gray'%3E%3Cpath d='M5 3a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V3zm1 0v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2zm-1 5a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h2zm-1 1H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z'/%3E%3C/svg%3E")`,
  },
  folder: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='gray'%3E%3Cpath d='M1 4a1 1 0 0 1 1-1h5l2 2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4z'/%3E%3C/svg%3E")`,
  },
  more: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='gray'%3E%3Cpath d='M8 9.5A1.5 1.5 0 1 1 8 6a1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM3.5 9.5A1.5 1.5 0 1 1 3.5 6a1.5 1.5 0 0 1 0 3z'/%3E%3C/svg%3E")`,
  },
};

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
      preview: {
        default: "inline",
        values: ["inline", "card"],
      },
    },
    content: "none",
  },
  {
    render: (props: any) => {
      console.log(props.inlineContent.props);
      const { noteId }: any = useParams();
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
          `/root/note/${noteId}/${props.inlineContent.props.user.index}`
        );
      };
      const cardStyles = {
        inline: (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
            }}
            className=" -mt-1 cursor-pointer p-1 rounded-md hover:bg-gray-100 flex relative"
            onClick={() => getFolder()}
          >
            <div className={`${iconClasses.file}`} style={iconStyles.file} />
            <div
              className="border-b-[2px]"
              onClick={() => onClickMention(!open)}
            >
              {props.inlineContent.props.user.title}
            </div>
          </div>
        ),
        card: (
          <div
            className="relative -mt-2 -ml-2 cursor-pointer hover:bg-gray-100 mx-auto bg-white border-gray-200 border rounded-lg overflow-hidden"
            onClick={() => getFolder()}
          >
            <div className="w-[780px]">
              <div className="text-start px-1 py-2">
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    className="p-1 rounded-md"
                  >
                    <div
                      className={`${iconClasses.file}`}
                      style={iconStyles.file}
                    />
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
        <span className="group">
          <span className=" -mt-12 group-hover:[transform:perspective(0px)_translateZ(0)_rotateX(0deg)] bg-white absolute transform rounded text-blue-gray opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className=" shadow-xl flex gap-1 ">
              <Tooltip content="開く">
                <div
                  className="cursor-pointer hover:bg-gray-100 rounded p-2 border-r-2 text-xs text-center"
                  onClick={() => getFolder()}
                >
                  <div
                    className={`${iconClasses.file}`}
                    style={iconStyles.file}
                  ></div>
                </div>
              </Tooltip>
              <Tooltip content="埋め込み">
                <div
                  className="cursor-pointer hover:bg-gray-100 rounded p-2 text-xs text-center"
                  onClick={() => setCardStyle("inline")}
                >
                  <div
                    className={`${iconClasses.link}`}
                    style={iconStyles.link}
                  ></div>
                </div>
              </Tooltip>
              <Tooltip content="カード">
                <div
                  className="cursor-pointer hover:bg-gray-100 rounded p-2 border-r-2 text-xs text-center"
                  onClick={() => setCardStyle("card")}
                >
                  <div
                    className={iconClasses.folder}
                    style={iconStyles.folder}
                  ></div>
                </div>
              </Tooltip>
              <div className="cursor-pointer hover:bg-gray-100 rounded p-2 text-xs text-center">
                <div className={iconClasses.more} style={iconStyles.more}></div>
              </div>
            </div>
          </span>
          {cardStyle == "inline" ? (
            <>{cardStyles.inline}</>
          ) : (
            <>{cardStyles.card}</>
          )}
        </span>
      );
    },
  }
);
