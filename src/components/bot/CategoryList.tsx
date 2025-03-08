// CategoryList.tsx

import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CategoryEditModal } from "./CategoryEditModal";
import { PencilIcon } from "lucide-react";

interface CategoryListProps {
  categoryItem: any[];
  onUpdateCategory: (updatedCategory: any) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categoryItem,
  onUpdateCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <Droppable droppableId="category-list">
        {(provided) => (
          <div
            className="shadow-lg p-4 ml-4 w-full overflow-y-auto"
            style={{ maxHeight: "400px" }} // 最大高さを設定
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {categoryItem.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`relative w-full text-white my-2 p-2 rounded-md text-xs cursor-pointer group ${
                      snapshot.isDragging ? "opacity-75" : "bg-blue-500"
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      backgroundColor: item.color,
                      ...provided.draggableProps.style,
                    }}
                  >
                    <div className="break-words">
                      {item.category.length > 20
                        ? `${item.category.slice(0, 20)}...`
                        : item.category}
                    </div>
                    {/* 編集アイコンをホバー時に表示 */}
                    <button
                      className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // ドラッグを防ぐ
                        setSelectedCategory(item);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* 編集モーダル */}
      {isEditModalOpen && selectedCategory && (
        <CategoryEditModal
          category={selectedCategory}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          onUpdate={(updatedCategory) => {
            onUpdateCategory(updatedCategory);
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </>
  );
};
