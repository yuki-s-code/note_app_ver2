import { memo } from "react";
import progress from "../../libs/utils/progress";
// import { extractTextFromJSON } from "../board/utils/extractTextFromJson";

const TimeLimeItem = memo(({ item }: any) => {
  const prog = progress(item.updatedAt);

  return (
    <div className="flex items-center w-full my-6 -ml-1.5">
      <div className="w-1/12 z-10">
        <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
      </div>
      <div className="w-11/12">
        <p className="text-sm text-gray-500">@{item.user}</p>
        <div className=" text-sm">{item.contents}</div>
        <p className="text-xs text-gray-500">{prog}</p>
      </div>
    </div>
  );
});
export default TimeLimeItem;
