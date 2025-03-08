// DiffNoteViewer.tsx

import React, { useState, useCallback } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/libs/app/hooks";
import { selectCodeState } from "@/slices/noteSlice";

export const DiffNoteViewr = () => {
  const codeStateItems: any = useAppSelector(selectCodeState);
  const maxDiff = codeStateItems.length - 1; // 最大インデックス（3）
  const minDiff = 1; // 最小インデックス（1）

  const [currentDiff, setCurrentDiff] = useState<number>(maxDiff); // 初期は最新の差分
  const [direction, setDirection] = useState<number>(0); // -1: 左へ, 1: 右へ

  const handleLeftClick = useCallback(() => {
    setDirection(-1);
    setCurrentDiff((prev) => Math.max(prev - 1, minDiff));
  }, [minDiff]);

  const handleRightClick = useCallback(() => {
    setDirection(1);
    setCurrentDiff((prev) => Math.min(prev + 1, maxDiff));
  }, [maxDiff]);

  // アニメーションのバリアント定義
  const variants = {
    initial: (custom: number) => ({
      opacity: 0,
      x: custom > 0 ? 100 : -100,
      scale: 0.95,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: (custom: number) => ({
      opacity: 0,
      x: custom > 0 ? -100 : 100,
      scale: 0.95,
      transition: { duration: 0.5, ease: "easeInOut" },
    }),
  };

  // タイトルを動的に設定
  const leftTitle = currentDiff === 1 ? "初期" : `履歴 ${currentDiff - 1}`;
  const rightTitle = currentDiff === maxDiff ? "最新" : `履歴 ${currentDiff}`;

  // 差分カウントの表示を逆転
  const displayDiffCount = maxDiff - currentDiff + 1;

  return (
    <div className="max-w-4xl mx-auto p-4 text-sm">
      {/* ナビゲーションボタン */}
      <div className="flex justify-center gap-4 mb-2">
        <button
          onClick={handleLeftClick}
          disabled={currentDiff <= minDiff}
          className={`p-2 rounded-md focus:outline-none transition transform ${
            currentDiff <= minDiff
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
          }`}
          aria-label="1つ前の差分へ移動"
        >
          前へ
        </button>
        <button
          onClick={handleRightClick}
          disabled={currentDiff >= maxDiff}
          className={`p-2 rounded-md focus:outline-none transition transform ${
            currentDiff >= maxDiff
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
          }`}
          aria-label="最新へ"
        >
          次へ
        </button>
      </div>

      {/* 差分表示にアニメーションを追加 */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentDiff} // 差分が変わるたびにアニメーションをトリガー
          custom={direction}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
        >
          <ReactDiffViewer
            leftTitle={leftTitle}
            rightTitle={rightTitle}
            oldValue={codeStateItems[currentDiff - 1]?.code}
            newValue={codeStateItems[currentDiff].code}
            splitView={false}
            disableWordDiff={false}
            showDiffOnly={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* 現在の差分インデックス表示 */}
      <div className="mt-2 text-center text-sm text-gray-600">
        差分 {displayDiffCount} / {maxDiff}
      </div>
    </div>
  );
};
