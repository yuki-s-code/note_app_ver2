// CategoryEditModal.tsx

import React, { useState } from "react";
import { TwitterPicker } from "react-color";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";

interface CategoryEditModalProps {
  category: any;
  onClose: () => void;
  onUpdate: (updatedCategory: any) => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  category,
  onClose,
  onUpdate,
}) => {
  const [categoryName, setCategoryName] = useState(category.category);
  const [categoryColor, setCategoryColor] = useState(category.color);

  const { updateBotCategory }: any = useMutateBot();

  const handleUpdate = () => {
    const updatedCategory = {
      ...category,
      category: categoryName,
      color: categoryColor,
    };

    updateBotCategory.mutate(updatedCategory, {
      onSuccess: () => {
        onUpdate(updatedCategory);
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">カテゴリーを編集</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            カテゴリー名
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            カラー
          </label>
          <TwitterPicker
            color={categoryColor}
            onChangeComplete={(color: any) => setCategoryColor(color.hex)}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
};
