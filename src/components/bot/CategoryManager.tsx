// CategoryManager.tsx

import React, { useState } from "react";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";
import { useQueryBotCategory } from "@/libs/hooks/noteHook/useQueryBot";
import { TwitterPicker } from "react-color";
import { nanoid } from "nanoid";
import { Modal } from "./Modal"; // モーダルコンポーネントをインポート

export const CategoryManager = () => {
  const { refetch }: any = useQueryBotCategory();
  const { addBotCategory }: any = useMutateBot();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#000000");

  // 新しいカテゴリーを追加する関数
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = {
        id: nanoid(),
        category: newCategoryName,
        color: newCategoryColor,
      };
      addBotCategory.mutate(newCat, {
        onSuccess: () => {
          refetch();
          setNewCategoryName("");
          setNewCategoryColor("#000000");
          setIsFormVisible(false);
        },
      });
    }
  };

  return (
    <div className="p-4 ml-8">
      <h2 className="text-lg font-bold mb-4">カテゴリー管理</h2>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-full text-xs"
        onClick={() => setIsFormVisible(true)}
      >
        新規カテゴリー登録
      </button>

      {/* モーダル */}
      <Modal isVisible={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <h3 className="text-lg font-bold mb-4">新規カテゴリー登録</h3>
        <input
          type="text"
          className="text-sm shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          placeholder="新規カテゴリーを入力してください"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <TwitterPicker
          color={newCategoryColor}
          onChangeComplete={(color: any) => setNewCategoryColor(color.hex)}
          triangle="hide"
          width="100%"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded text-xs"
            onClick={() => setIsFormVisible(false)}
          >
            キャンセル
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-xs"
            onClick={handleAddCategory}
          >
            カテゴリー追加
          </button>
        </div>
      </Modal>
    </div>
  );
};
