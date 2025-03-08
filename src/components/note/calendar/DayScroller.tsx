// DayScroller.tsx

import React, { useEffect, useRef } from "react";
import { addDays, differenceInDays, format } from "date-fns";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { getData } from "../utils/getData";

interface DayScrollerProps {
  selectedDate: Date | null;
  setSelected: (date: Date | null) => void;
  setMonth: (date: Date) => void;
  handleTodayClick: () => void;
}

export const DayScroller: React.FC<DayScrollerProps> = ({
  selectedDate,
  setSelected,
  setMonth,
  handleTodayClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevDay = () => {
    if (selectedDate) {
      setSelected(addDays(selectedDate, -1));
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      setSelected(addDays(selectedDate, 1));
    }
  };

  const handleDayClick = (day: Date) => {
    setSelected(day);
    setMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    const item: any = { index: format(day, "yyyy-MM-dd"), type: "journals" };
    getData(item);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const targetScrollLeft =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
      scrollContainer.scrollLeft = targetScrollLeft;
    }
  }, [selectedDate]);

  if (!selectedDate) return null;

  const todayIndex = 3;
  const startDate = addDays(selectedDate, -todayIndex);
  const endDate = addDays(selectedDate, 6 - todayIndex);
  const daysCount = differenceInDays(endDate, startDate) + 1;
  const daysToDisplay = Array.from({ length: daysCount }, (_, i) =>
    addDays(startDate, i)
  );

  return (
    <div className=" relative flex items-center border-b-2 border-gray-100 w-full">
      <button className="text-xl cursor-pointer" onClick={handlePrevDay}>
        <HiChevronLeft />
      </button>
      <div
        className=" w-full relative flex gap-10 overflow-x-auto scrollbar-hide space-x-2 ml-2 mr-2"
        ref={scrollContainerRef}
      >
        {daysToDisplay.map((day) => (
          <Link
            key={format(day, "yyyy-MM-dd")}
            to={`/root/note/journals/${format(day, "yyyy-MM-dd")}`}
          >
            <div
              className={`text-xs inline-flex flex-col items-center justify-center py-1 px-2 cursor-pointer rounded-md hover:bg-gray-200 ${
                format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                  ? "bg-blue-600 rounded-full text-white"
                  : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              <span className="text-current">{format(day, "EEE")}</span>
              <span>{format(day, "M/d")}</span>
            </div>
          </Link>
        ))}
      </div>
      <button className="text-xl cursor-pointer" onClick={handleNextDay}>
        <HiChevronRight />
      </button>
      <button
        className="ml-2 px-2 py-1 bg-gray-100 text-xs text-blue-gray-500 rounded-md hover:bg-gray-200"
        onClick={handleTodayClick}
      >
        Today
      </button>
    </div>
  );
};
