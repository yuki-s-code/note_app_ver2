import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCompareIcon, PaletteIcon } from "lucide-react";
import { DayOrNoteSwitch } from "./DayOrNoteSwitch";
import { Icon } from "./Icon";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/libs/app/hooks";
import { getData } from "./getData";
import { FcDataSheet } from "react-icons/fc";
import { setItemIndex, setTitleId } from "@/slices/noteSlice";

// アイコンのアニメーションバリアント
const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};
const CHARACTER_LIMIT = 20000;
const SVG_CIRCUMFERENCE = 31.4;

export const AccordionComponent = ({
  editor,
  isChecked,
  setIsChecked,
  mentionId,
  result,
  charCount,
  openDiff,
  setOpenDiff,
  openAccordion,
}: any) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(1);
  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);
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
  const mentionString: any | null = localStorage.getItem("mentionCount");
  const mentionObject: any = useMemo(
    () => (mentionString ? JSON.parse(mentionString) : []),
    [mentionString]
  );
  const onClickTitled = useCallback(
    (m: any) => {
      dispatch(
        setTitleId({
          index: m.index,
          dataItem: m.title,
          dataIcon: m.icon,
          dataImage: m.image,
          dataType: m.type,
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
  const characterCount =
    editor?._tiptapEditor?.storage.characterCount.characters() || 0;

  const percentage = editor
    ? Math.round((100 / CHARACTER_LIMIT) * characterCount)
    : 0;

  const isWarning = characterCount >= CHARACTER_LIMIT;

  // AccordionHeader のクラス分岐処理を整理
  const headerMarginClass =
    openAccordion === "journals" ? (mentionId ? "ml-0" : "-ml-32") : "";

  return (
    <>
      <div className=" relative w-full -mt-2 flex gap-6 text-xs font-bold text-gray-500">
        <div className=" flex mt-1">
          <div>更新日</div>
          <div className=" ml-2">{dataToString()}</div>
        </div>

        <div
          className={`flex items-center text-xs gap-2 ml-2 ${
            charCount === CHARACTER_LIMIT ? "character-count--warning" : ""
          }`}
        >
          <svg className=" -mt-1" height="20" width="20" viewBox="0 0 20 20">
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
              className={`${isWarning ? "text-red-500" : "text-blue-500"}`}
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>
          <div>
            {charCount} / {CHARACTER_LIMIT}
          </div>
        </div>
        <div className=" ml-4">
          <Tooltip content={"差分表示"}>
            <motion.div
              className="cursor-pointer"
              variants={iconVariants}
              initial="initial"
              whileTap="tap"
              animate={"initial"}
            >
              <GitCompareIcon
                className={` ${openDiff ? " text-blue-400" : ""}`}
                onClick={() => setOpenDiff(!openDiff)}
              />
            </motion.div>
          </Tooltip>
        </div>
        <div className=" ml-4">
          <DayOrNoteSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
        </div>
      </div>
      <motion.div
        className={`relative w-full flex ${openAccordion == "note" ? "mt-4" : "mt-20"}`}
        initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in initial state
        animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in animate state
        exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in exit state
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 0.5 },
          marginLeft: { type: "spring", stiffness: 200, damping: 10 },
        }}
      >
        <Accordion
          open={open === 0}
          icon={<Icon id={0} open={open} />}
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
        >
          <AccordionHeader
            className={`text-xs text-gray-400 mt-2 w-10/12 ${headerMarginClass} transition-all duration-300`}
            onClick={() => handleOpen(1)}
            placeholder="true"
            onPointerEnterCapture
            onPointerLeaveCapture
          >
            INFO
          </AccordionHeader>
          <AccordionBody>
            <div className=" flex">
              <div className="-mt-4">
                <Popover placement="top-start">
                  <PopoverHandler>
                    <Button
                      placeholder="true"
                      onPointerEnterCapture
                      onPointerLeaveCapture
                      variant="text"
                      className=" text-gray-500 flex"
                    >
                      <VscFileSymlinkFile className=" w-4 h-4 mr-1" />
                      <div>Pageリンク数 {mentionObject.length}</div>
                    </Button>
                  </PopoverHandler>
                  {mentionObject.length ? (
                    <PopoverContent
                      placeholder="true"
                      onPointerEnterCapture
                      onPointerLeaveCapture
                      className=" max-h-64 overflow-y-auto"
                    >
                      {mentionObject.map((l: any) => (
                        <Link
                          key={l.index}
                          to={`/root/note/${l.index}`}
                          className="flex cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            onClickTitled(l);
                            getData(l);
                          }}
                        >
                          <Typography
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            className=" w-56 flex"
                          >
                            {l.type == "sheet" ? (
                              <FcDataSheet className=" mt-1" />
                            ) : (
                              l.icon
                            )}
                            {l.title}
                          </Typography>
                        </Link>
                      ))}
                    </PopoverContent>
                  ) : null}
                </Popover>
              </div>
              <div className="ml-8 -mt-4">
                <Popover placement="top-start">
                  <PopoverHandler>
                    <Button
                      placeholder="true"
                      onPointerEnterCapture
                      onPointerLeaveCapture
                      variant="text"
                      className=" text-gray-500 flex"
                    >
                      <VscFileSymlinkFile className=" w-4 h-4 mr-1" />
                      <div>Backリンク数 {result.length}</div>
                    </Button>
                  </PopoverHandler>
                  {result.length ? (
                    <PopoverContent
                      placeholder="true"
                      onPointerEnterCapture
                      onPointerLeaveCapture
                      className=" max-h-64 overflow-y-auto"
                    >
                      {result.map((l: any) => (
                        <Link
                          key={l.index}
                          to={`/root/note/${l.index}`}
                          className="flex cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            onClickTitled(l);
                            getData(l);
                          }}
                        >
                          <Typography
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            className=" w-56 flex"
                          >
                            {l.data.type == "sheet" ? (
                              <FcDataSheet className=" mt-1" />
                            ) : l.data.type == "excalidraw" ? (
                              <PaletteIcon className=" h-4 w-4 mt-1" />
                            ) : (
                              l.data.icon
                            )}
                            {l.data.title}
                          </Typography>
                        </Link>
                      ))}
                    </PopoverContent>
                  ) : null}
                </Popover>
              </div>
            </div>
          </AccordionBody>
        </Accordion>
      </motion.div>
    </>
  );
};
