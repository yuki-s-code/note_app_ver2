import { useState } from "react";
import BoardList from "./BoardList";
import BoardFavorite from "./BoardFavorite";

const BoardTab = () => {
  const tabsData = [
    {
      label: "すべて",
      content: (
        <div className="flex flex-col flex-grow">
          <BoardList />
        </div>
      ),
    },
    {
      label: "お気に入り",
      content: (
        <div className="flex flex-col flex-grow">
          <BoardFavorite />
        </div>
      ),
    },
  ];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div className="p-4">
      <div className="flex space-x-3 border-b text-xs">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab, idx) => {
          return (
            <div
              key={idx}
              className={`py-2 border-b-4 transition-colors duration-300 ${
                idx === activeTabIndex
                  ? "border-teal-500"
                  : "border-transparent hover:border-gray-200"
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </div>
          );
        })}
      </div>
      {/* Show active tab content. */}
      <div className="py-4">
        <div>{tabsData[activeTabIndex].content}</div>
      </div>
    </div>
  );
};
export default BoardTab;
