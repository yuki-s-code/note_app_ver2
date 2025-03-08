// NoteApp.tsx

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAppSelector } from "@/libs/app/hooks";
import { selectPeekDisplay, selectTitleId } from "@/slices/noteSlice";
import LiveBlock from "./LiveBlock";
import XApp from "./x_sheet/XApp";
import { Outlet, useParams } from "react-router-dom";

export const NoteApp = () => {
  const data: any = useAppSelector(selectTitleId);
  const { mentionId }: any = useParams();
  const { peekDisplay }: any = useAppSelector(selectPeekDisplay);
  const controls = useAnimation(); // アニメーションを制御するための controls オブジェクト

  useEffect(() => {
    // mentionId の有無に応じてアニメーションを制御
    if (mentionId && peekDisplay) {
      controls.start({ width: "50%" }); // 幅を 50% に変更
    } else {
      controls.start({ width: "100%" }); // 幅を 100% に変更
    }
  }, [mentionId, controls, peekDisplay]); // mentionId と peekDisplay が変更されたら再実行

  return (
    <>
      {data.dataType === "sheet" ? (
        <XApp />
      ) : (
        <div className={`${mentionId && peekDisplay ? "flex" : ""}`}>
          <motion.div
            className={`${mentionId && peekDisplay ? "w-1/2" : ""}`}
            animate={controls} // controls オブジェクトでアニメーションを制御
            transition={{ duration: 0.5, ease: "easeOut" }} // アニメーションの時間とイージングを設定
          >
            <LiveBlock />
          </motion.div>
          <div className="sticky overflow-x-auto pl-12">
            {mentionId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} // 初期状態: 非表示、少し縮小
                animate={{ opacity: 1, scale: 1 }} // アニメーション後: 表示、元のサイズ
                exit={{ opacity: 0, scale: 0.9 }} // コンポーネントが消える際のアニメーション
                transition={{ duration: 1 }} // アニメーション時間
                className="fixed top-12"
              >
                <Outlet />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NoteApp;
