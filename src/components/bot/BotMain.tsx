//BotMain.tsx

import { BotMainFirst } from "./BotMainFirst";
import { BotMainSecond } from "./BotMainSecond";
import { ModelStyle } from "./types/types";

export const BotMain = ({ modelItem }: { modelItem: ModelStyle[] }) => {
  return (
    <div className="flex flex-col items-start text-sm">
      <BotMainFirst />
      {modelItem.length > 0 && <BotMainSecond modelItem={modelItem} />}
    </div>
  );
};
