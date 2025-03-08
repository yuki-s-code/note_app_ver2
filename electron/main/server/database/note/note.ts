// server/database/note/note.ts

import NeDB from 'nedb';
import path from 'path';
import moji from "moji";
import TinySegmenter from "tiny-segmenter";
import { format } from 'date-fns'; // date-fnsをインポート

import { fileURLToPath } from "node:url";

const __filename = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.dirname(__filename)

// インターフェース定義
export interface NoteTree {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: {
    title: string;
    icon: string;
    image: string;
    type: string;
  };
  canRename: boolean;
  roots: boolean;
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFolder {
  id: string;
  title: string;
  contents: any;
  searchableContents: string; // 追加
  pageLinks: string[];
  user: string;
  parent?: string;
}

export interface NoteDataSheet {
  id: string;
  contents: any;
  pageLinks: string[];
  user: string;
}

export interface NoteTrash {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: {
    title: string;
    icon: string;
    image: string;
    type: string;
  };
  canRename: boolean;
  roots: boolean;
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 検索結果のインターフェース
export interface SearchResult {
  id: string;
  title: string;
  icon: string;
  image: string;
  type: string;
  contents: any;
  updatedAt: Date;
}

// オプション型の定義
type UpdateOptions = {
  multi?: boolean;
  upsert?: boolean;
  returnUpdatedDocs?: boolean;
};

type RemoveOptions = {
  multi?: boolean;
};

// データベース初期化関数
function initializeDB<T>(filename: string): NeDB<T> {
  return new NeDB<T>({
    filename: path.join(__dirname, filename).replace('app.asar', 'app.asar.unpacked'),
    autoload: true,
    timestampData: true,
    onload: (err: any) => {
      console.log(`${filename} loaded, err ? Error: ${err} : 'Success'`);
    },
  });
}
/**
 * contents オブジェクトからすべてのテキストを抽出する再帰関数
 * @param contentItems - contents の配列
 * @returns 抽出されたテキストの結合文字列
 */
function extractTextFromContents(contentItems: any[]): string {
  let text = '';

  contentItems.forEach(item => {
    if (item.type === 'text' && item.text) {
      text += item.text + ' ';
    }

    // children が存在する場合、再帰的にテキストを抽出
    if (item.children && Array.isArray(item.children)) {
      text += extractTextFromContents(item.children);
    }

    // content が存在する場合、再帰的にテキストを抽出
    if (item.content) {
      if (Array.isArray(item.content)) {
        text += extractTextFromContents(item.content);
      } else if (typeof item.content === 'object') {
        if (item.content.rows) { // テーブルの場合
          item.content.rows.forEach((row: any) => {
            row.cells.forEach((cell: any[]) => {
              cell.forEach(cellItem => {
                if (cellItem.type === 'text' && cellItem.text) {
                  text += cellItem.text + ' ';
                }
              });
            });
          });
        } else {
          text += extractTextFromContents([item.content]);
        }
      }
    }
  });

  return text.trim();
}

const segmenter = new TinySegmenter();

function _tokenize(text: any) {
  return segmenter.segment(text)
}

function tokenize(text: any) {
    const query = moji(text).convert("HK", "ZK").convert("ZS", "HS").convert("ZE", "HE").toString().trim()
    return _tokenize(query).map((word: any) => {
        if (word !== " ") {
            return moji(word).convert("HG", "KK").toString().toLowerCase();
        }
    }).filter((v: any) => v)
}

// データベースの初期化
export const noteTreeDB = initializeDB<NoteTree>('data/notetree.db');
export const noteFolderDB = initializeDB<NoteFolder>('data/notefolder.db');
export const noteDataSheetDB = initializeDB<NoteDataSheet>('data/notedatasheet.db');
export const noteTrashDB = initializeDB<NoteTrash>('data/notetrash.db');

// NeDB のメソッドを Promise 化
function promisifyNeDB<T>(db: NeDB<T>) {
  return {
    find: (query: any, options: any = {}): Promise<T[]> => {
      return new Promise((resolve, reject) => {
        let cursor = db.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);
        cursor.exec((err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    },
    findOne: (query: any): Promise<T | null> => {
      return new Promise((resolve, reject) => {
        db.findOne(query, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
    },
    insert: ((doc: any): Promise<T | T[]> => {
      return new Promise((resolve, reject) => {
        db.insert(doc, (err: any, newDoc: T | T[]) => {
          if (err) reject(err);
          else resolve(newDoc);
        });
      });
    }) as {
      (doc: T): Promise<T>;
      (doc: T[]): Promise<T[]>;
    },
    update: (query: any, update: any, options: UpdateOptions = {}): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numAffected) => {
          if (err) reject(err);
          else resolve(numAffected);
        });
      });
    },
    remove: (query: any, options: RemoveOptions = {}): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
    },
    count: (query: any): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.count(query, (err, count) => {
          if (err) reject(err);
          else resolve(count);
        });
      });
    },
  };
}

// プロミス化した DB 操作オブジェクト
const noteTreeDBAsync = promisifyNeDB<NoteTree>(noteTreeDB);
const noteFolderDBAsync = promisifyNeDB<NoteFolder>(noteFolderDB);
const noteDataSheetDBAsync = promisifyNeDB<NoteDataSheet>(noteDataSheetDB);
const noteTrashDBAsync = promisifyNeDB<NoteTrash>(noteTrashDB);

// データ取得関数
export const getTree = async (): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({});
};

export const getTrees = async (): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({ "data.type": { $ne : "journals"} });
};

export const getAllJournals = async (): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({ "data.type": "journals" });
};

export const getAllJournalsFolder = async (): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({}, { sort: { updatedAt: -1 } });
};

export const getTreeId = async (index: string): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({ index });
};

export const getFolder = async (id: string): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({ id });
};

export const getDataSheet = async (id: string): Promise<NoteDataSheet[]> => {
  return await noteDataSheetDBAsync.find({ id });
};

export const getAllFolder = async (): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({}, { sort: { updatedAt: -1 } });
};

export const getAllSortFolder = async (limit: number): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({}, { sort: { updatedAt: -1 }, limit });
};

export const getParentFolder = async (parentId: string, value: string): Promise<NoteTree[]> => {
  const titleRegex = new RegExp(value, "g");
  return await noteTreeDBAsync.find({
    "data.title": titleRegex,
    parent: parentId,
  });
};

export const getMyParentFolder = async (myParentId: string): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({ id: myParentId });
};

export const addRootCreateFolder = async (
  uuid: string,
  data: { title: string; icon: string; image: string },
  type: string
): Promise<NoteFolder | null> => {
  try {
    const regDoc: NoteTree = {
      index: uuid,
      canMove: true,
      isFolder: true,
      children: [],
      data: {
        title: data.title,
        icon: data.icon,
        image: data.image,
        type,
      },
      canRename: true,
      roots: true,
      bookmarks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const regDocs: NoteFolder = {
      id: uuid,
      title: data.title,
      contents: [],
      searchableContents: '', // 初期値として空文字列
      pageLinks: [],
      user: "all",
    };

    await noteTreeDBAsync.insert(regDoc);
    await noteFolderDBAsync.insert(regDocs);
    return regDocs;
  } catch (error) {
    console.error("Error in addRootCreateFolder:", error);
    return null;
  }
};

export const addRootCreateNote = async (
  uuid: string,
  data: { title: string; icon: string; image: string },
  type: string
): Promise<NoteFolder | NoteDataSheet  | null> => {
  try {
    const regDoc: NoteTree = {
      index: uuid,
      canMove: true,
      isFolder: false,
      children: [],
      data: {
        title: data.title,
        icon: data.icon,
        image: data.image,
        type,
      },
      canRename: true,
      roots: true,
      bookmarks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await noteTreeDBAsync.insert(regDoc);

    let newDoc: NoteFolder | NoteDataSheet  | null = null;

    switch (type) {
      case "note":
      case "journals":
        newDoc = await noteFolderDBAsync.insert({
          id: uuid,
          title: data.title,
          contents: {},
          searchableContents: '', // 初期値として空文字列
          pageLinks: [],
          user: "all",
        }) as NoteFolder;
        break;
      case "sheet":
        newDoc = await noteDataSheetDBAsync.insert({
          id: uuid,
          contents: {},
          pageLinks: [],
          user: "all",
        }) as NoteDataSheet;
        break;
      default:
        console.error("Invalid type provided in addRootCreateNote");
        break;
    }
    return newDoc;
  } catch (error) {
    console.error("Error in addRootCreateNote:", error);
    return null;
  }
};

export const addJournals = async (
  uuid: string,
  data: { icon: string; image: string },
  type: string,
  journalData: any,
  pageLinks: { added: string[]; removed: string[] }
): Promise<NoteFolder | null> => {
  const { added, removed } = pageLinks;
  try {
    const regDoc: Partial<NoteTree> = {
      index: uuid,
      canMove: true,
      isFolder: false,
      children: [],
      data: {
        title: uuid,
        icon: data.icon,
        image: data.image,
        type,
      },
      canRename: true,
      roots: true,
      bookmarks: [],
      updatedAt: new Date(),
    };

    const regDocs: NoteFolder = {
      id: uuid,
      title: uuid,
      contents: journalData, // 配列として渡す
      searchableContents: extractTextFromContents(journalData as any[]) || '', // 追加
      pageLinks: [],
      user: "all",
    };

    await noteTreeDBAsync.update({ index: uuid }, regDoc, { upsert: true });
    await noteFolderDBAsync.update({ id: uuid }, regDocs, { upsert: true });

    // Handle pageLinks additions
    if (added.length) {
      const addPromises = added.map((id) =>
        noteFolderDBAsync.update({ id }, { $push: { pageLinks: uuid } }, {})
      );
      await Promise.all(addPromises);
    }

    // Handle pageLinks removals
    if (removed.length) {
      const removePromises = removed.map((id) =>
        noteFolderDBAsync.update({ id }, { $pull: { pageLinks: uuid } }, {})
      );
      await Promise.all(removePromises);
    }

    return regDocs;
  } catch (error) {
    console.error("Error in addJournals:", error);
    return null;
  }
};

export const addCreateFolder = async (
  index: string,
  parentId: string,
  type: string
): Promise<NoteFolder | null> => {
  try {
    const regDoc: NoteTree = {
      index,
      canMove: true,
      isFolder: true,
      children: [],
      data: {
        title: "無題",
        icon: "📁",
        image: '',
        type,
      },
      canRename: true,
      roots: false,
      bookmarks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const regDocs: NoteFolder = {
      id: index,
      title: "無題",
      contents: [],
      searchableContents: '', // 初期値として空文字列
      pageLinks: [],
      user: "all",
      parent: parentId,
    };

    await noteTreeDBAsync.update({ index: parentId }, { $push: { children: index } }, {});
    await noteTreeDBAsync.insert(regDoc);
    // searchableContents を生成（空の場合は空文字列）
    regDocs.searchableContents = extractTextFromContents(regDocs.contents as any[]) || '';
    await noteFolderDBAsync.insert(regDocs);
    return regDocs;
  } catch (error) {
    console.error("Error in addCreateFolder:", error);
    return null;
  }
};

export const addCreateNote = async (
  index: string,
  parentId: string,
  type: string
): Promise<NoteFolder | NoteDataSheet  | null> => {
  try {
    const icon = type === "note" ? "📝" : type === "excalidraw" ? "✏️" : "📄";

    const regDoc: NoteTree = {
      index,
      canMove: true,
      isFolder: false,
      children: [],
      data: {
        title: "無題",
        icon,
        image: '',
        type,
      },
      canRename: true,
      roots: false,
      bookmarks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await noteTreeDBAsync.update({ index: parentId }, { $push: { children: index } }, {});
    await noteTreeDBAsync.insert(regDoc);

    let newDoc: NoteFolder | NoteDataSheet  | null = null;

    switch (type) {
      case "note":
        newDoc = await noteFolderDBAsync.insert({
          id: index,
          title: "無題",
          contents: [],
          searchableContents: '', // 初期値として空文字列
          pageLinks: [],
          user: "all",
          parent: parentId,
        }) as NoteFolder;
        break;
      case "sheet":
        newDoc = await noteDataSheetDBAsync.insert({
          id: index,
          contents: [], // 空の配列として初期化
          pageLinks: [],
          user: "all",
        }) as NoteDataSheet;
        break;
      default:
        console.error("Invalid type provided in addCreateNote");
        break;
    }

    // searchableContents を生成（NoteFolder の場合）
    if (newDoc && 'searchableContents' in newDoc) {
      newDoc.searchableContents = extractTextFromContents(newDoc.contents as any[]) || '';
      await noteFolderDBAsync.update({ id: index }, { $set: { searchableContents: newDoc.searchableContents } }, {});
    }

    return newDoc;
  } catch (error) {
    console.error("Error in addCreateNote:", error);
    return null;
  }
};

// ツリーの更新関数
export const updateTree = async (
  index: string,
  title: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.title": title, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTree:", error);
    return null;
  }
};

export const updateTreeIcon = async (
  index: string,
  icon: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.icon": icon, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeIcon:", error);
    return null;
  }
};

export const updateTreeImage = async (
  index: string,
  image: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.image": image, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeImage:", error);
    return null;
  }
};

export const updateTreeBookMarked = async (
  index: string,
  data: string,
  trueToFalse: boolean
): Promise<number | null> => {
  try {
    if (trueToFalse) {
      const numAffected = await noteTreeDBAsync.update(
        { index },
        { 
          $push: { bookmarks: data },
          $set: { updatedAt: new Date() }
        },
        {}
      );
      return numAffected;
    } else {
      const numAffected = await noteTreeDBAsync.update(
        { index },
        { 
          $pull: { bookmarks: data },
          $set: { updatedAt: new Date() }
        },
        {}
      );
      return numAffected;
    }
  } catch (error) {
    console.error("Error in updateTreeBookMarked:", error);
    return null;
  }
};

export const updateTreeType = async (
  index: string,
  type: string
): Promise<number | null> => {
  try {
    const typeItem = type === "folder" ? true : false;
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.type": type, isFolder: typeItem, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeType:", error);
    return null;
  }
};

// ツリーソートの更新関数（★ 修正済み ★）
export const updateTreeSort = async (
  target: string,
  data: string[],
  fileTree: Record<string, string[]>
): Promise<{ success: boolean }> => {
  try {
    // すべての既存のツリーを更新
    const updatePromises = Object.keys(fileTree).map(async (key) => {
      if (key === "root") {
        return Promise.all(
          fileTree[key].map(async (d) => {
            return noteTreeDBAsync.update(
              { index: d },
              {
                $set: {
                  roots: false,
                  updatedAt: new Date(),
                },
              },
              {}
            );
          })
        );
      }
      return Promise.all(
        fileTree[key].map(async (childIndex) => {
          return noteTreeDBAsync.update(
            { index: key },
            {
              $pull: { children: childIndex },
              // ★ ここを $set に分離することでエラー回避
              $set: { updatedAt: new Date() },
            },
            {}
          );
        })
      );
    });

    await Promise.all(updatePromises);

    // ターゲットにアイテムを追加
    if (target === "root") {
      await Promise.all(
        data.map(async (d) => {
          return noteTreeDBAsync.update(
            { index: d },
            {
              $set: {
                roots: true,
                updatedAt: new Date(),
              },
            },
            {}
          );
        })
      );
    } else {
      await noteTreeDBAsync.update(
        { index: target },
        {
          $push: { children: { $each: data } },
          $set: { updatedAt: new Date() },
        },
        {}
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateTreeSort:", error);
    return { success: false };
  }
};

// ゴミ箱関連関数
export const trashInsert = async (index: string): Promise<number | null> => {
  try {
    const docs: any = await noteTreeDBAsync.find({ index });
    if (docs.length === 0) return null;

    await noteTrashDBAsync.insert(docs);
    const numRemoved = await noteTreeDBAsync.remove({ index }, {});
    return numRemoved;
  } catch (error) {
    console.error("Error in trashInsert:", error);
    return null;
  }
};

export const getAllTrash = async (limit: number): Promise<NoteTrash[]> => {
  return await noteTrashDBAsync.find({}, { sort: { updatedAt: -1 }, limit });
};

// コンテンツ編集関数
export const editedFolderContents = async (
  id: string,
  contents: any,
  pageLinks: { added: string[]; removed: string[] }
): Promise<number | null> => {
  const { added, removed } = pageLinks;
  try {
    const update = { 
      $set: { 
        contents, 
        updatedAt: new Date(),
        // searchableContents: extractTextFromContents(contents as any[]) || '' // 追加
      } 
    };
    const numAffected = await noteFolderDBAsync.update({ id }, update, {});

    // Handle pageLinks additions
    if (added.length) {
      const addPromises = added.map((linkId) =>
        noteFolderDBAsync.update({ id: linkId }, { $push: { pageLinks: id } }, {})
      );
      await Promise.all(addPromises);
    }

    // Handle pageLinks removals
    if (removed.length) {
      const removePromises = removed.map((linkId) =>
        noteFolderDBAsync.update({ id: linkId }, { $pull: { pageLinks: id } }, {})
      );
      await Promise.all(removePromises);
    }

    return numAffected;
  } catch (error) {
    console.error("Error in editedFolderContents:", error);
    return null;
  }
};

export const editedDataSheetContents = async (
  id: string,
  contents: any
): Promise<number | null> => {
  try {
    const update = { $set: { contents, updatedAt: new Date() } };
    const numAffected = await noteDataSheetDBAsync.update({ id }, update, {});
    return numAffected;
  } catch (error) {
    console.error("Error in editedDataSheetContents:", error);
    return null;
  }
};

// 新しいブロックの作成
export const newBlocks = async (
  id: string,
  contents: any,
  user: string,
  editorTitle: string,
  icon: string
): Promise<number | null> => {
  try {
    const regDoc: NoteFolder = {
      id,
      title: editorTitle,
      contents, // 配列として渡す
      searchableContents: extractTextFromContents(contents as any[]) || '', // 追加
      pageLinks: [],
      user,
    };

    await noteFolderDBAsync.insert(regDoc);
    const numAffected = await noteTreeDBAsync.update(
      { index: id },
      { $set: { "data.title": editorTitle, "data.icon": icon, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in newBlocks:", error);
    return null;
  }
};

// 親フォルダの選択
export const selectParent = async (id: string, parentId: string): Promise<number | null> => {
  try {
    const numAffected = await noteFolderDBAsync.update(
      { id },
      { $set: { parent: parentId, updatedAt: new Date() } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in selectParent:", error);
    return null;
  }
};

// フォルダの削除
export const selectDelete = async (id: string): Promise<number | null> => {
  try {
    await noteTreeDBAsync.remove({ index: id }, {});
    const numRemovedFolder = await noteFolderDBAsync.remove({ id }, {});
    return numRemovedFolder;
  } catch (error) {
    console.error("Error in selectDelete:", error);
    return null;
  }
};

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// クエリをトークン化・カタカナ化する関数（既存tokenize利用）
function tokenizeForSearch(query: string) {
  return tokenize(query); // tokenize関数はカタカナ＋lowercase変換済み
}

// カタカナ→ひらがな変換
function toHiragana(katakana: string) {
  return moji(katakana).convert("KK","HG").toString();
}

// フォルダ検索
export const searchFolders = async (query: string, page: number, limit: number): Promise<{ results: SearchResult[]; hasMore: boolean }> => {
  const skip = (page - 1) * limit;

  // クエリのトークン化と正規表現の作成
  const katakanaTokens: any[] = tokenizeForSearch(query);
  const tokenPatterns = katakanaTokens.map(katakana => {
    const hiragana = toHiragana(katakana);
    return `(?=.*(?:${escapeRegex(katakana)}|${escapeRegex(hiragana)}))`;
  });
  const combinedPattern = tokenPatterns.join('') + '.*';
  const regex = new RegExp(combinedPattern, 'i');

  // タイトルと検索可能なコンテンツにマッチするツリーの取得
  const titleMatches = await noteTreeDBAsync.find(
    { 'data.title': regex },
    { sort: { updatedAt: -1 } }
  );
  const folderMatches = await noteFolderDBAsync.find(
    { 'searchableContents': regex }
  );
  const folderIds = folderMatches.map(folder => folder.id);
  const contentMatches = await noteTreeDBAsync.find(
    { index: { $in: folderIds } },
    { sort: { updatedAt: -1 } }
  );

  // 結果の統合と重複の排除
  const combined = [...titleMatches, ...contentMatches];
  const uniqueMap = new Map<string, NoteTree>();
  combined.forEach(item => {
    if (!uniqueMap.has(item.index)) {
      uniqueMap.set(item.index, item);
    }
  });
  const uniqueResults = Array.from(uniqueMap.values());

  // 更新日時で降順ソート
  uniqueResults.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  // ページネーション
  const paginatedResults = uniqueResults.slice(skip, skip + limit);
  const hasMore = uniqueResults.length > page * limit;

  // 検索結果のマッピング
  const searchResults: SearchResult[] = await Promise.all(
    paginatedResults.map(async (tree) => {
      const folder = await noteFolderDBAsync.findOne({ id: tree.index });
      return {
        id: tree.index,
        title: tree.data.title,
        icon: tree.data.icon,
        image: tree.data.image,
        type: tree.data.type,
        contents: folder?.contents || "",
        searchableContents: folder?.searchableContents || "",
        updatedAt: tree.updatedAt,
      };
    })
  );

  return { results: searchResults, hasMore };
};

export const getJournalsByMonth = async (startDate: Date, endDate: Date): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({
    "data.type": "journals",
    index: {
      $gte: format(startDate, 'yyyy-MM-dd'),
      $lt: format(endDate, 'yyyy-MM-dd'),
    }
  });
};

export const hasUncheckedItems = (items: any[]): boolean => {
  for (const item of items) {
    if (item.type === 'checkListItem' && item.props.checked === false) {
      return true;
    }
    if (item.children && Array.isArray(item.children)) {
      if (hasUncheckedItems(item.children)) {
        return true;
      }
    }
    if (item.content && Array.isArray(item.content)) {
      if (hasUncheckedItems(item.content)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Retrieves all folders that have at least one unchecked 'checkListItem'
 */
export const getFoldersWithUncheckedItems = async (): Promise<NoteFolder[]> => {
  try {
    // titleが "YYYY-MM-DD" の形式に一致するフォルダのみを取得
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateFolders = await noteFolderDBAsync.find(
      { title: dateRegex },
      { sort: { updatedAt: -1 } }
    );
    
    // 未処理の項目を持つフォルダをフィルタリング
    const filteredFolders = dateFolders.filter(folder => hasUncheckedItems(folder.contents));
    return filteredFolders;
  } catch (error) {
    console.error("Error in getFoldersWithUncheckedItems:", error);
    throw error;
  }
};