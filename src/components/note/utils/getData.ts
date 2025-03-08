//getData.ts

import axios from "axios";

// メンション情報を表すインターフェース
interface Mention {
  index: string;     // メンション先のアイテムのインデックス
  title: string;     // メンション先のアイテムのタイトル
  icon: string;      // メンション先のアイテムのアイコン
  image: string;     // メンション先のアイテムの画像
  type: string;      // メンション先のアイテムのタイプ (sheet, excalidraw, folder)
}

// メンションされているユーザーを抽出する関数 (オブジェクトにも対応)
export function extractMentionedUsers(data: any): Mention[] {
  const uniqueUsers = new Set<string>();
  function extractRecursively(content: any) {
    if (Array.isArray(content)) {
      content.forEach(extractRecursively);
    } else if (content && typeof content === 'object') {
      if (content.type === 'mention') {
        uniqueUsers.add(JSON.stringify(content.props.user));
      } else if (content.type === 'tableContent') {
        content.rows.forEach((row: any) => row.cells.forEach(extractRecursively));
      } else {
        // オブジェクトのプロパティを再帰的に探索
        Object.values(content).forEach(extractRecursively);
      }
    }
  }

  extractRecursively(data); // data を直接探索

  return Array.from(uniqueUsers, (userStr) => JSON.parse(userStr));
}

// オブジェクトが空かどうか判定する関数
const isEmpty = (obj: any) => Object.keys(obj).length === 0;

// APIのベースURL (設定ファイルに移動するとより良い)
const apiUrl = "http://localhost:8088/notes"; 

// データを取得する関数 (汎用化)
async function fetchData(index: string, dataType: string) {
  const endpoints: any = {
    sheet: "/get_data_sheet",
    excalidraw: "/get_excalidraw",
    folder: "/get_folder",
    note: "/get_folder",
    journals: "/get_folder",
  };

  const response = await axios.get(`${apiUrl}${endpoints[dataType]}`, {
    params: { id: index },
  });
  return response.data;
}

// データを取得してlocalStorageに保存する関数 (統合)
export async function getData(item: any) {
  localStorage.removeItem("editorContent");
  localStorage.removeItem("editorPageLinks")
  localStorage.removeItem("dataSheetContent");
  const data = await fetchData(item.index || item.data.index, item.type || item.data.type);
  // データの存在チェックとデフォルト値の設定
  const docs = data.docs || [];
  const firstDoc = docs[0];

  if (item.type === "sheet" || item.data?.type === "sheet") {
    localStorage.setItem("dataSheetContent", JSON.stringify(firstDoc.contents));
  } else {
      if (!firstDoc || isEmpty(firstDoc.contents)) {
        localStorage.setItem("editorContent", JSON.stringify(""));
        localStorage.setItem("mentionCount", JSON.stringify([]));
      } else {
        localStorage.setItem(
          "editorContent",
          JSON.stringify(firstDoc.contents)
        );
        localStorage.setItem(
          "editorPageLinks",
          JSON.stringify(firstDoc.pageLinks)
        );
        localStorage.setItem(
          "editorContentUpdated",
          JSON.stringify(firstDoc.updatedAt)
        );
      const mentions = extractMentionedUsers(firstDoc.contents);
      localStorage.setItem("mentionCount", JSON.stringify(mentions));
    }
  }
}
