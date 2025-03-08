// BotMainSecond.tsx

import React, { Fragment, useState } from "react";
import { ModelStyle } from "./types/types";
import { motion } from "framer-motion";

interface BotMainSecondProps {
  modelItem: ModelStyle[];
}

export const BotMainSecond: React.FC<BotMainSecondProps> = React.memo(
  ({ modelItem }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const words = (m: any) => {
      if (m) {
        return m.split("");
      } else {
        return "回答が見つかりませんでした。";
      }
    };
    return (
      <>
        {modelItem.map((item, index) => (
          <Fragment key={item.id}>
            {item.path === "bot" ? (
              <div
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="relative"
              >
                <div className="rounded-xl px-4 py-2 mb-2 w-auto max-w-full m-4">
                  <div className="w-full whitespace-normal break-words text-blue-gray-600">
                    {words(item.answer).map((char: any, i: any) => (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.005 }}
                        key={i}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-400 -mt-1 flex text-xs">
                  <div className="pl-6">{item.timestamp.date}</div>
                  <div className="pl-2">{item.timestamp.time}</div>
                </div>
              </div>
            ) : (
              <>
                {item.questions.map((msg, msgIndex) => (
                  <div
                    key={msgIndex}
                    className="bg-gray-200 text-gray-600 rounded-xl px-4 py-2 ml-auto flex w-auto max-w-[80%] m-4"
                  >
                    <div className="w-auto max-w-full whitespace-normal break-words text-blue-gray-600">
                      {msg}
                    </div>
                  </div>
                ))}
                <div className="text-gray-400 ml-auto pr-2 -mt-3 flex text-xs">
                  <div className="pl-6">{item.timestamp.date}</div>
                  <div className="pl-2">{item.timestamp.time}</div>
                </div>
              </>
            )}
          </Fragment>
        ))}
      </>
    );
  }
);
