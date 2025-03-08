import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import CalendarApp from "./CalendarApp";
import { DayScroller } from "./DayScroller";
import { JournalEditor } from "./JournalEditor";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { PanelRightOpen } from "lucide-react";

const MIN_CALENDAR_WIDTH = 200;

export const JournalApp = memo(() => {
  const { mentionId }: any = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [openRight, setOpenRight] = useState(false);
  const [calendarWidth, setCalendarWidth] = useState(320); // 初期幅
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0); // ドラッグ開始時のX座標
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setStartX(e.clientX);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = startX - e.clientX;
        const newWidth = calendarWidth + deltaX;
        setCalendarWidth(Math.max(newWidth, MIN_CALENDAR_WIDTH));
        setStartX(e.clientX);
      }
    },
    [isResizing, startX, calendarWidth]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const today = new Date();
  const [month, setMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const handleTodayClick = useCallback(() => {
    const todayDate = new Date();
    setSelected(todayDate);
    setMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
    navigate(`/root/note/journals/${format(todayDate, "yyyy-MM-dd")}`);
  }, [navigate]);

  const toggleSidebar = useCallback(() => {
    setOpenRight((prev) => !prev);
  }, []);

  return (
    <>
      <div className="flex">
        {/* メインコンテンツエリア */}
        <div className="flex flex-col flex-1">
          {/* ヘッダー */}
          <header className="w-full fixed top-0 z-20 bg-white h-20 flex items-center px-4">
            {/* 左側: DayScroller */}
            <div className="flex items-center space-x-4">
              <DayScroller
                selectedDate={selected}
                setSelected={setSelected}
                setMonth={setMonth}
                handleTodayClick={handleTodayClick}
              />
            </div>

            {/* 右側: サイドバーのトグルボタン */}
            {!openRight && (
              <div className="flex items-center h-screen">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-blue-500"
                  aria-label="Toggle Calendar Sidebar"
                >
                  <PanelRightOpen size={24} />
                </button>
              </div>
            )}
          </header>

          {/* スクロール可能なメインエリア */}
          <div className="mt-12 flex-1 overflow-y-auto overflow-x-hidden p-2 hover-scrollbar">
            <JournalEditor openRight={openRight} />
          </div>
        </div>

        {/* サイドバー - CalendarApp */}
        {openRight && (
          <aside
            ref={sidebarRef}
            className=" flex-none transition-width duration-200 z-20 bg-white"
            style={{ width: calendarWidth }}
          >
            <div className="flex h-full">
              {/* リサイズハンドル */}
              <div
                className="w-[2px] bg-gray-300 cursor-ew-resize hover:bg-blue-500 hover:w-[6px] h-full"
                onMouseDown={handleMouseDown}
                onDoubleClick={() => setOpenRight(false)}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize Calendar Sidebar"
              />
              {/* CalendarApp */}
              <div className="flex-1 overflow-y-auto hover-scrollbar p-2">
                <CalendarApp
                  selected={selected}
                  onSelect={setSelected}
                  month={month}
                  onMonthChange={setMonth}
                  today={today}
                  handleTodayClick={handleTodayClick}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* モーダルやアウトレット */}
      {mentionId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed top-20 left-0 w-full z-30"
        >
          <Outlet />
        </motion.div>
      )}
    </>
  );
});

export default JournalApp;
