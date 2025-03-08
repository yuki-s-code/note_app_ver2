// FAQForm.tsx

import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { ModelStyle, Intent, Category } from "./types/types";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";
import { nanoid } from "nanoid";

interface FAQFormProps {
  formData: ModelStyle;
  setFormData: React.Dispatch<React.SetStateAction<ModelStyle>>;
  setCreateOpen: (open: boolean) => void;
  intents: Intent[];
  categories: Category[]; // 追加
}

export const FAQForm: React.FC<FAQFormProps> = React.memo(
  ({ formData, setFormData, setCreateOpen, intents, categories }) => {
    const { addBot }: any = useMutateBot();

    // カテゴリー名と色を取得する関数
    const getCategoryDetails = (categoryId: string) => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category
        ? { name: category.category, color: category.color }
        : { name: "不明なカテゴリー", color: "#cccccc" };
    };

    // カテゴリー削除関数を useCallback でメモ化して、無駄な再レンダリングを防ぐ
    const handleCategoryDelete = useCallback(
      (categoryId: string) => {
        setFormData((prevState) => ({
          ...prevState,
          category: prevState.category.filter(
            (id: string) => id !== categoryId
          ),
          // intentId をリセットする必要がある場合は以下を有効化
          // intentId: prevState.intentId && !intents.some(intent => intent.id === prevState.intentId && intent.categoryId === categoryId) ? "" : prevState.intentId,
        }));
      },
      [setFormData]
    );

    // フォーム送信処理
    const submitHandler = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addBot.mutate({
          id: nanoid(),
          category: formData.category, // そのまま使用
          intentId: formData.intentId,
          questions: formData.questions,
          answer: formData.answer,
        });
        setCreateOpen(false);
      },
      [formData, addBot, setCreateOpen]
    );

    // 選択されたカテゴリーに関連付けられたインテントを取得
    const filteredIntents = intents.filter((intent: Intent) =>
      formData.category.includes(intent.categoryId)
    );

    return (
      <Droppable droppableId="faq-form">
        {(provided, snapshot) => (
          <form
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="hover-scrollbar w-10/12 h-[480px] overflow-y-auto"
            onSubmit={submitHandler} // フォーム送信時に submitHandler を呼び出す
          >
            <div className="mb-12">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="category"
              >
                カテゴリー
              </label>
              <div
                className={`flex flex-wrap gap-2 h-auto ${
                  snapshot.isDraggingOver ? "bg-blue-100" : ""
                }`}
              >
                {formData.category.map((catId: string) => {
                  const { name, color } = getCategoryDetails(catId);
                  return (
                    <div
                      key={catId}
                      className="relative text-white px-2 py-1 rounded-full flex items-center text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {name}
                      <button
                        type="button"
                        className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-gray-400 text-white rounded-full p-1 text-xs opacity-0 hover:opacity-60 transition-opacity duration-200"
                        onClick={() => handleCategoryDelete(catId)}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              {provided.placeholder}
            </div>

            {/* インテントの選択フィールドを追加 */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="intent"
              >
                インテント
              </label>
              <select
                id="intent"
                name="intent"
                className="w-full border border-gray-300 rounded p-2"
                value={formData.intentId}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    intentId: e.target.value,
                  }))
                }
                required
                disabled={formData.category.length === 0} // カテゴリーが選択されていない場合は無効化
              >
                <option value="">
                  {formData.category.length === 0
                    ? "カテゴリーを選択してください"
                    : "インテントを選択してください"}
                </option>
                {filteredIntents.length > 0 ? (
                  filteredIntents.map((intent: Intent) => (
                    <option key={intent.id} value={intent.id}>
                      {intent.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    関連するインテントがありません
                  </option>
                )}
              </select>
            </div>

            {/* 質問の入力フィールド */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="question"
              >
                質問
              </label>
              <textarea
                className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                id="question"
                name="question"
                placeholder="質問を入力してください。複数の質問がある場合は改行してください。"
                value={formData.questions.join("\n")}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    questions: e.target.value.split("\n"),
                  }))
                }
                required
              />
            </div>

            {/* 回答の入力フィールド */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="answer"
              >
                回答
              </label>
              <textarea
                className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                id="answer"
                name="answer"
                placeholder="回答を入力してください"
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    answer: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* ボタン */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit" // typeを"submit"に変更してフォーム送信を制御
              >
                保存
              </button>
            </div>
          </form>
        )}
      </Droppable>
    );
  }
);
