// BotCreate.tsx

import React, { useState, useEffect } from "react";
import { CategoryList } from "./CategoryList";
import { FAQForm } from "./FAQForm";
import { DragDropContext } from "react-beautiful-dnd";
import {
  useQueryBotCategory,
  useQueryIntents,
} from "@/libs/hooks/noteHook/useQueryBot";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { CategoryManager } from "./CategoryManager";

export const BotCreate = ({ setCreateOpen }: any) => {
  const {
    status: categoryStatus,
    data: categories,
    refetch,
  }: any = useQueryBotCategory();
  const { status: intentStatus, data: intents }: any = useQueryIntents();

  const [formData, setFormData] = useState<any>({
    id: "",
    category: [], // カテゴリーIDの配列に変更
    questions: [],
    answer: "",
    keywords: [],
    relatedFAQs: [],
    intentId: "",
  });

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const draggedCategory = categories.find(
      (item: any) => item.id === draggableId
    );

    if (draggedCategory && !formData.category.includes(draggedCategory.id)) {
      setFormData((prevState: any) => ({
        ...prevState,
        category: [...prevState.category, draggedCategory.id], // IDを追加
      }));
    }
  };

  // カテゴリーの更新時に呼び出される関数
  const handleUpdateCategory = () => {
    // カテゴリーリストを再取得
    refetch();
  };

  // カテゴリー選択の変更に応じてインテント選択をリセット
  useEffect(() => {
    if (formData.intentId) {
      const selectedIntent = intents.find(
        (intent: any) => intent.id === formData.intentId
      );
      if (
        selectedIntent &&
        !formData.category.includes(selectedIntent.categoryId)
      ) {
        setFormData((prevState: any) => ({
          ...prevState,
          intentId: "", // インテント選択をリセット
        }));
      }
    }
  }, [formData.category, formData.intentId, intents]);

  if (categoryStatus === "loading" || intentStatus === "loading")
    return <Loding />;
  if (categoryStatus === "error" || intentStatus === "error") return <Error />;

  if (categoryStatus === "success" && intentStatus === "success") {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="shadow-xl bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-5xl mx-auto">
          <div className="flex justify-between p-4 space-x-4">
            {/* FAQForm */}
            <div className="flex-1 overflow-y-auto">
              <FAQForm
                formData={formData}
                setFormData={setFormData}
                setCreateOpen={setCreateOpen}
                intents={intents}
                categories={categories} // 追加
              />
            </div>
            <div className="w-3/12">
              {/* カテゴリーマネージャーを表示 */}
              <CategoryManager />

              {/* ドロップされたカテゴリーは CategoryList から非表示に */}
              <CategoryList
                categoryItem={categories.filter(
                  (item: any) => !formData.category.includes(item.id)
                )}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      </DragDropContext>
    );
  }
  return null;
};
