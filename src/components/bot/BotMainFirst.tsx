//BotMainFirst.tsx

import React from "react";
import { dateNavigation, timeNavigation } from "../note/utils/dateNavigation";
import { motion } from "framer-motion";

const message =
  "こんにちは！私は、ユニバーです。Shibataが開発した最新のAIアシスタントです。どんな質問やお手伝いが必要か教えてくださいね。芦屋市に関することから日常のちょっとした疑問まで、幅広くサポートしますので、どうぞお気軽にご相談ください！";

export const BotMainFirst: React.FC = () => {
  const word = message.split("");
  const timestamp = { date: dateNavigation(), time: timeNavigation() };

  return (
    <>
      <div className="rounded-xl px-4 py-2 mb-2 w-auto max-w-full m-4">
        <div className="w-full whitespace-normal break-words text-blue-gray-600">
          {word.map((char: any, i: any) => (
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
        <div className="pl-6">{timestamp.date}</div>
        <div className="pl-2">{timestamp.time}</div>
      </div>
    </>
  );
};
