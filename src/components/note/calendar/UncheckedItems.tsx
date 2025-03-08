// UncheckedItems.tsx

import React, { JSX } from "react";
import { Error } from "@/components/atoms/fetch/Error";
import { Loding } from "@/components/atoms/fetch/Loding";
import { useQueryUncheckedItems } from "@/libs/hooks/noteHook/useQueryFolderBlocks";

const renderUncheckedItems = (items: any[]): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  const traverse = (item: any, depth: number = 0) => {
    if (item.type === "checkListItem" && item.props.checked === false) {
      elements.push(
        <div key={item.id} style={{ marginLeft: depth * 20 }}>
          <input type="checkbox" checked={false} readOnly />
          <span className=" pl-1">
            {item.content.map((c: any) => c.text).join(" ")}
          </span>
        </div>
      );
    }
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach((child: any) => traverse(child, depth + 1));
    }
    if (item.content && Array.isArray(item.content)) {
      item.content.forEach((child: any) => traverse(child, depth));
    }
  };

  items.forEach((item) => traverse(item));

  return elements;
};

export const UncheckedItems = () => {
  const { data, status } = useQueryUncheckedItems();
  console.log(data);
  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div>
      {data && data.length > 0 ? (
        data.map((folder) => (
          <div
            key={folder.id}
            className=" text-blue-gray-700 list-disc list-inside ml-4"
          >
            <div className=" font-bold">{folder.title}</div>
            {/* 'unchecked' な項目を表示 */}
            {renderUncheckedItems(folder.contents)}
          </div>
        ))
      ) : (
        <div>全て処理済み</div>
      )}
    </div>
  );
};
