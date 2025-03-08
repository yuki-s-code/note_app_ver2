// notJournalItem.ts

interface ItemData {
  type: string;
  // 他のプロパティを必要に応じて追加
}

interface Item {
  data: ItemData;
  children?: string[];
  // 他のプロパティを必要に応じて追加
}

interface Items {
  [key: string]: Item;
}

const filterItems = (items: Items, typesToExclude: string[]) => {
  // 除外するキーを特定
  const keysToExclude = new Set(
    Object.entries(items)
      .filter(
        ([key, value]: [string, Item]) =>
          key !== "root" && typesToExclude.includes(value.data.type)
      )
      .map(([key]) => key)
  );

  // 除外されたアイテムを除く新しいアイテムオブジェクトを作成
  const filteredItems = Object.entries(items)
    .filter(([key]) => !keysToExclude.has(key))
    .reduce((obj: any, [key, value]: [string, any]) => {
      obj[key] = { ...value };
      return obj;
    }, {});

  // 他のアイテムの children 配列から除外されたアイテムの参照を削除
  Object.values(filteredItems).forEach((item: any) => {
    if (item.children) {
      item.children = item.children.filter(
        (childId: string) => !keysToExclude.has(childId)
      );
    }
  });

  return filteredItems;
};

export const notJournalItem = (items: any) => {
  return filterItems(items, ["journals"]);
};

export const journalItem = (items: any) => {
  return filterItems(items, ["note", "folder"]);
};