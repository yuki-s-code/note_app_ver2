// IntentCreateModal.tsx

import React, { useState } from "react";
import { Modal } from "./Modal";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";
import { useQueryBotCategory } from "@/libs/hooks/noteHook/useQueryBot";
import { Category } from "./types/types";
import { nanoid } from "nanoid";

interface IntentCreateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const IntentCreateModal: React.FC<IntentCreateModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData]: any = useState({
    id: nanoid(),
    name: "",
    categoryId: "",
    description: "",
  });

  const { addIntent } = useMutateBot();
  const { data: categoriesData }: any = useQueryBotCategory();
  console.log(categoriesData);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIntent.mutate(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <Modal isVisible={true} onClose={onClose}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">新しいインテントを追加</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* カテゴリー選択 */}
          <div>
            <label className="block text-gray-700">カテゴリー</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
            >
              <option value="">カテゴリーを選択</option>
              {categoriesData?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          {/* インテント名 */}
          <div>
            <label className="block text-gray-700">インテント名</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          {/* 説明 */}
          <div>
            <label className="block text-gray-700">説明</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          {/* ボタン */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
