// BotEdit.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";
import { Intent, ModelStyle, Category } from "./types/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Tooltip } from "@material-tailwind/react";
import {
  useQueryIntents,
  useQueryBotCategory,
} from "@/libs/hooks/noteHook/useQueryBot";
import { Loding } from "../atoms/fetch/Loding";
import { ErrorComponent } from "./ErrorComponent";

export const BotEdit = ({ botData, onClose }: any) => {
  const [formData, setFormData]: any = useState<ModelStyle>(botData);
  const { updateQABot } = useMutateBot();

  const {
    data: intentsData,
    status: intentsStatus,
    refetch: refetchIntents,
  } = useQueryIntents();
  const {
    data: categoriesData,
    status: categoriesStatus,
    refetch: refetchCategories,
  } = useQueryBotCategory();

  const intents = useMemo(() => intentsData || [], [intentsData]);
  const updatedCategories = useMemo(
    () => categoriesData || [],
    [categoriesData]
  );

  // 選択されたカテゴリーに関連付けられたインテントを取得
  const filteredIntents = useMemo(() => {
    if (formData.category.length === 0) return [];
    return intents.filter((intent: Intent) =>
      formData.category.some((cat: Category) => cat.id === intent.categoryId)
    );
  }, [formData.category, intents]);

  // カテゴリー選択の変更に応じてインテント選択をリセット
  useEffect(() => {
    if (formData.intentId) {
      const selectedIntent = intents.find(
        (intent: Intent) => intent.id === formData.intentId
      );
      if (
        selectedIntent &&
        !formData.category.some(
          (cat: Category) => cat.id === selectedIntent.categoryId
        )
      ) {
        setFormData((prevState: any) => ({
          ...prevState,
          intentId: "", // インテント選択をリセット
        }));
      }
    }
  }, [formData.category, formData.intentId, intents]);

  // カテゴリーの更新時に呼び出される関数
  const handleUpdateCategory = useCallback(() => {
    refetchCategories();
  }, [refetchCategories]);

  // カテゴリー名と色を取得する関数
  const getCategoryDetails = (categoryId: string) => {
    const category = updatedCategories.find(
      (cat: Category) => cat.id === categoryId
    );
    return category
      ? { name: category.category, color: category.color }
      : { name: "不明なカテゴリー", color: "#cccccc" };
  };

  // カテゴリー削除関数
  const handleCategoryDelete = useCallback(
    (categoryId: string) => {
      setFormData((prevState: any) => ({
        ...prevState,
        category: prevState.category.filter(
          (cat: Category) => cat.id !== categoryId
        ),
        intentId: prevState.intentId, // 必要に応じてリセット
      }));
    },
    [setFormData]
  );

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const categoryIds = formData.category.map((cat: Category) => cat.id);
    // Bot の更新処理
    updateQABot.mutate(
      {
        ...formData,
        category: categoryIds,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          console.error("Botの更新に失敗しました:", error);
          // エラーハンドリングを追加可能
        },
      }
    );
  };

  // インテント選択フィールドを無効化するかどうか
  const isIntentDisabled = formData.category.length === 0;

  // ドラッグ終了時の処理
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId === "available" &&
      destination.droppableId === "selected"
    ) {
      // 利用可能なカテゴリーから選択されたカテゴリーへ追加
      const categoryToAdd = updatedCategories.find(
        (cat) => cat.id === draggableId
      );
      if (
        categoryToAdd &&
        !formData.category.some((cat: Category) => cat.id === categoryToAdd.id)
      ) {
        setFormData((prevState: any) => ({
          ...prevState,
          category: [...prevState.category, categoryToAdd],
        }));
      }
    } else if (
      source.droppableId === "selected" &&
      destination.droppableId === "available"
    ) {
      // 選択されたカテゴリーから利用可能なカテゴリーへ削除
      setFormData((prevState: any) => ({
        ...prevState,
        category: prevState.category.filter(
          (cat: Category) => cat.id !== draggableId
        ),
      }));
    } else if (
      source.droppableId === "selected" &&
      destination.droppableId === "selected"
    ) {
      // 選択されたカテゴリー内での並べ替え
      const reordered = Array.from(formData.category);
      const [movedCategory] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, movedCategory);
      setFormData((prevState: any) => ({
        ...prevState,
        category: reordered,
      }));
    }
    // "available" 内での並べ替えは不要
  };

  // ローディングやエラー状態のハンドリング
  if (intentsStatus === "loading" || categoriesStatus === "loading") {
    return <Loding />;
  }

  if (intentsStatus === "error" || categoriesStatus === "error") {
    return (
      <ErrorComponent
        onRetry={() => {
          refetchIntents();
          refetchCategories();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 質問の編集 */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">質問</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 overflow-y-auto"
          placeholder="質問を入力してください。複数ある場合は改行してください。"
          value={formData.questions.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              questions: e.target.value.split("\n"),
            })
          }
          required
        />
      </div>

      {/* 回答の編集 */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">回答</label>
        <textarea
          className="hover-scrollbar w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 overflow-y-auto"
          placeholder="回答を入力してください。"
          value={formData.answer}
          onChange={(e) =>
            setFormData({
              ...formData,
              answer: e.target.value,
            })
          }
          required
        />
      </div>

      {/* カテゴリーの編集 */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          カテゴリー
        </label>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* 利用可能なカテゴリー */}
            <Droppable droppableId="available">
              {(provided) => (
                <div
                  className="w-full md:w-1/2 p-4 border border-gray-300 rounded-lg min-h-[100px] max-h-40 overflow-y-auto relative"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-gray-700 font-semibold mb-2">
                    利用可能なカテゴリー
                  </h3>
                  <div className="flex flex-col gap-2">
                    {updatedCategories
                      .filter(
                        (cat) =>
                          !formData.category.some(
                            (selectedCat: any) => selectedCat.id === cat.id
                          )
                      )
                      .map((cat, index) => (
                        <Draggable
                          key={cat.id}
                          draggableId={cat.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`px-3 py-1 rounded-full shadow-sm cursor-pointer text-sm ${
                                snapshot.isDragging ? "opacity-75" : ""
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: cat.color,
                                border: `1px solid ${cat.color}`,
                                color: getContrastingTextColor(cat.color),
                              }}
                            >
                              <Tooltip content={cat.category}>
                                <span className="whitespace-nowrap">
                                  {cat.category.length > 20
                                    ? `${cat.category.slice(0, 20)}…`
                                    : cat.category}
                                </span>
                              </Tooltip>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>

            {/* 選択されたカテゴリー */}
            <Droppable droppableId="selected">
              {(provided) => (
                <div
                  className="w-full md:w-1/2 p-4 border border-gray-300 rounded-lg min-h-[100px] max-h-40 overflow-y-auto relative"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-gray-700 font-semibold mb-2">
                    選択されたカテゴリー
                  </h3>
                  <div className="flex flex-col gap-2">
                    {formData.category.map((cat: Category, index: number) => (
                      <Draggable
                        key={cat.id}
                        draggableId={cat.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`px-3 py-1 rounded-full shadow-sm cursor-pointer text-sm relative ${
                              snapshot.isDragging ? "opacity-75" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: cat.color,
                              border: `1px solid ${cat.color}`,
                              color: getContrastingTextColor(cat.color),
                            }}
                          >
                            <Tooltip content={cat.category}>
                              <span className="whitespace-nowrap">
                                {cat.category.length > 20
                                  ? `${cat.category.slice(0, 20)}…`
                                  : cat.category}
                              </span>
                            </Tooltip>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      {/* インテントの編集 */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          インテント
        </label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={formData.intentId}
          onChange={(e) =>
            setFormData({ ...formData, intentId: e.target.value })
          }
          required
          disabled={isIntentDisabled} // カテゴリーが選択されていない場合は無効化
        >
          <option value="">
            {isIntentDisabled
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

      {/* ボタン */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          onClick={onClose}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          保存
        </button>
      </div>
    </form>
  );
};

// テキストカラーを背景色に応じて決定する関数
const getContrastingTextColor = (bgColor: string): string => {
  const color = bgColor.substring(1); // '#'を除去
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};
