//routes/note.ts

import express from 'express';
import {
  addCreateFolder,
  addCreateNote,
  addJournals, addRootCreateFolder,
  addRootCreateNote,
  editedDataSheetContents,
  editedFolderContents,
  getAllFolder,
  getAllJournals,
  getAllSortFolder,
  getAllTrash,
  getDataSheet,
  getFolder,
  getFoldersWithUncheckedItems,
  getJournalsByMonth,
  getTree,
  getTreeId,
  getTrees,
  newBlocks,
  searchFolders,
  selectDelete,
  selectParent,
  trashInsert,
  updateTree,
  updateTreeBookMarked,
  updateTreeIcon,
  updateTreeImage,
  updateTreeSort,
  updateTreeType
} from '../database/note/note';

const expressApp = express.Router();

expressApp.get('/get_folder_tree', async (req: any, res: any) => {
  try {
    const docs = await getTree();

    const rootData: any = [];
    const rootObject: any = {};
    const complexNote = {
      root: {
        index: 'root',
        canMove: true,
        isFolder: true,
        children: [],
        data: { title: '無題', icon: '📝', image: '', type: '' },
        canRename: true,
      },
    };

    let updatedTreeItems: any;

    if (docs.length) {
      docs.forEach((t: any) => {
        if (t.roots) {
          rootData.push(t.index);
        }
        rootObject[t.index] = {
          index: t.index,
          canMove: t.canMove,
          isFolder: t.isFolder,
          children: t.children,
          data: t.data,
          canRename: t.canRename,
          bookmarks: t.bookmarks,
        };
      });
      updatedTreeItems = {
        ...complexNote,
        ...rootObject,
        root: {
          ...complexNote.root,
          children: rootData,
        },
      };
    }
    res.json({ status: true, docs, updatedTreeItems, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});


expressApp.get('/get_folder_trees', async (req: any, res: any) => {
  try {
    const docs = await getTrees();

    const rootData: any = [];
    const rootObject: any = {};
    const complexNote = {
      root: {
        index: 'root',
        canMove: true,
        isFolder: true,
        children: [],
        data: { title: '無題', icon: '📝', image: '', type: '' },
        canRename: true,
      },
    };

    let updatedTreeItems: any;

    if (docs.length) {
      docs.forEach((t: any) => {
        if (t.roots) {
          rootData.push(t.index);
        }
        rootObject[t.index] = {
          index: t.index,
          canMove: t.canMove,
          isFolder: t.isFolder,
          children: t.children,
          data: t.data,
          canRename: t.canRename,
          bookmarks: t.bookmarks,
        };
      });
      updatedTreeItems = {
        ...complexNote,
        ...rootObject,
        root: {
          ...complexNote.root,
          children: rootData,
        },
      };
    }
    res.json({ status: true, docs, updatedTreeItems, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.get('/get_folder_tree_id', async (req: any, res: any) => {
  const { index } = req.query;
  try {
    const docs = await getTreeId(index);
    res.json({ status: true, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.get('/get_all_journals', async (req, res) => {
  try {
    const docs = await getAllJournals();
    res.json({ status: true, docs, msg: 'journals をすべて取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '取得できませんでした', error: err.message });
  }
});

expressApp.get('/get_folder', async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const docs = await getFolder(id);
    res.json({ status: true, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.get('/get_data_sheet', async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const docs = await getDataSheet(id);
    res.json({ status: true, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.get('/get_all_folder', async (req: any, res: any) => {
  try {
    const docs = await getAllFolder();
    res.json({ status: true, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.get('/get_all_sort_folder', async (req: any, res: any) => {
  const { page } = req.query;
  try {
    const docs = await getAllSortFolder(parseInt(page, 10));
    res.json({ status: true, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree_sort', async (req: any, res: any) => {
  const { target, data, fileTree } = req.body;
  try {
    const result = await updateTreeSort(target, data, fileTree);
    res.json({ status: true, msg: 'ツリーが更新されました。', result });
  } catch (err: any) {
    res.status(500).json({ status: false, msg: 'ツリーの更新に失敗しました。', error: err.message });
  }
});

expressApp.post('/trash_insert', async (req: any, res: any) => {
  const { index } = req.body;
  try {
    const numRemoved = await trashInsert(index);
    res.json({ status: true, numRemoved, msg: 'ゴミ箱に移動しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '移動できませんでした', error: err.message });
  }
});

expressApp.get('/get_all_trash', async (req: any, res: any) => {
  const { page } = req.query;
  try {
    const docs = await getAllTrash(parseInt(page, 10));
    res.json({ status: true, docs, msg: 'ゴミ箱の内容を取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '取得できませんでした', error: err.message });
  }
});

expressApp.post('/add_root_create_folder', async (req: any, res: any) => {
  const { items, uuid, type } = req.body;
  const { data } = items;
  try {
    const docs = await addRootCreateFolder(uuid, data, type);
    res.json({ status: true, docs, msg: 'フォルダを作成しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '作成できませんでした', error: err.message });
  }
});

expressApp.post('/add_root_create_note', async (req: any, res: any) => {
  const { items, uuid, type } = req.body;
  const { data } = items;
  try {
    const docs = await addRootCreateNote(uuid, data, type);
    res.json({ status: true, docs, msg: 'ノートを作成しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '作成できませんでした', error: err.message });
  }
});

expressApp.post('/add_journals', async (req: any, res: any) => {
  const { items, uuid, type, journalData, pageLinks } = req.body;
  const { data } = items;
  try {
    const docs = await addJournals(uuid, data, type, journalData, pageLinks);
    res.json({ status: true, docs, msg: 'ジャーナルを追加しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '追加できませんでした', error: err.message });
  }
});

expressApp.post('/add_create_folder', async (req: any, res: any) => {
  const { index, parentId, type } = req.body;
  try {
    const docs = await addCreateFolder(index, parentId, type);
    res.json({ status: true, docs, msg: 'フォルダを作成しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '作成できませんでした', error: err.message });
  }
});

expressApp.post('/add_create_note', async (req: any, res: any) => {
  const { index, parentId, type } = req.body;
  try {
    const docs = await addCreateNote(index, parentId, type);
    res.json({ status: true, docs, msg: 'ノートを作成しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '作成できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree', async (req: any, res: any) => {
  const { index, data } = req.body;
  try {
    const numAffected = await updateTree(index, data);
    res.json({ status: true, numAffected, msg: 'ツリーを更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree_icon', async (req: any, res: any) => {
  const { index, data } = req.body;
  try {
    const numAffected = await updateTreeIcon(index, data);
    res.json({ status: true, numAffected, msg: 'アイコンを更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree_image', async (req: any, res: any) => {
  const { index, data } = req.body;
  try {
    const numAffected = await updateTreeImage(index, data);
    res.json({ status: true, numAffected, msg: '画像を更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree_bookmarks', async (req: any, res: any) => {
  const { index, data, trueToFalse } = req.body;
  try {
    const numAffected = await updateTreeBookMarked(index, data, trueToFalse);
    res.json({ status: true, numAffected, msg: 'ブックマークを更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/update_tree_type', async (req: any, res: any) => {
  const { index, data } = req.body;
  try {
    const numAffected = await updateTreeType(index, data);
    res.json({ status: true, numAffected, msg: 'ブックマークを更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/edited_folder_contents', async (req: any, res: any) => {
  const { id, contents, pageLinks } = req.body;
  try {
    const numAffected = await editedFolderContents(id, contents, pageLinks);
    res.json({ status: true, numAffected, msg: 'フォルダの内容を更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/edited_data_sheet', async (req: any, res: any) => {
  const { id, contents } = req.body;
  try {
    const numAffected = await editedDataSheetContents(id, contents);
    res.json({ status: true, numAffected, msg: 'データシートを更新しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '更新できませんでした', error: err.message });
  }
});

expressApp.post('/select_parent', async (req: any, res: any) => {
  const { id, parentId } = req.body;
  try {
    const numAffected = await selectParent(id, parentId);
    res.json({ status: true, numAffected, msg: '親フォルダを選択しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '選択できませんでした', error: err.message });
  }
});

expressApp.post('/new_blocks', async (req: any, res: any) => {
  const { id, contents, user, editorTitle, icon } = req.body;
  try {
    const numAffected = await newBlocks(id, contents, user, editorTitle, icon);
    res.json({ status: true, numAffected, msg: '新しいブロックを作成しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '作成できませんでした', error: err.message });
  }
});

expressApp.post('/select_delete', async (req: any, res: any) => {
  const { id } = req.body;
  try {
    const numRemoved = await selectDelete(id);
    res.json({ status: true, numRemoved, msg: '削除できました' });
  } catch (err: any) {
    res.json({ status: false, msg: '削除に失敗しました', error: err.message });
  }
});

expressApp.get('/get_all_search', async (req: any, res: any) => {
  try {
    const docs = await getAllFolder();

    const textObjects: any = [];
    // テキストを抽出する再帰関数
    const extractText = (item: any): string => {
      let textContent = '';

      // contentがある場合、その中のtextを抽出
      if (item.content && item.content instanceof Array) {
        textContent += item.content
          .map((textItem: any) => {
            if (textItem.type === 'text' && textItem.text) {
              return textItem.text;
            }
            if (textItem.children && textItem.children instanceof Array) {
              return extractText(textItem); // 再帰的に子要素を処理
            }
            return '';
          })
          .join('');
      }

      // childrenがある場合、その中のtextを抽出
      if (item.children && item.children instanceof Array) {
        textContent += item.children
          .map((childItem: any) => {
            return extractText(childItem); // 再帰的に子要素を処理
          })
          .join('');
      }

      return textContent;
    };

    docs.forEach((item: any) => {
      if (item.contents && item.contents instanceof Array) {
        // contentsからテキストを抽出
        const textContent = item.contents
          .map((contentItem: any) => {
            if (contentItem.type === 'table') {
              // テーブルの場合
              if (contentItem.content && contentItem.content.rows instanceof Array) {
                // テーブル内の各セルからテキストを抽出
                return contentItem.content.rows
                  .map((row: any) => {
                    return row.cells
                      .map((cell: any) => {
                        return cell
                          .map((textItem: any) => {
                            if (textItem.type === 'text' && textItem.text) {
                              return textItem.text;
                            }
                            return '';
                          })
                          .join('');
                      })
                      .join('');
                  })
                  .join('');
              }
            } else {
              // テーブル以外の場合
              return extractText(contentItem);
            }
            return '';
          })
          .join('');
        textObjects.push({ id: item.id, contents: textContent, updatedAt: item.updatedAt });
      }
    });
    const textOb = textObjects.length ? textObjects : [{ id: '1', contents: 'なし' }];
    res.json({ status: true, textOb, docs, msg: '検索できました。' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

// 検索エンドポイントの追加
expressApp.get('/search', async (req: any, res: any) => {
  const { query, page = 1, limit = 20 } = req.query;
  
  if (!query) {
    return res.status(400).json({ status: false, msg: '検索クエリが必要です。' });
  }

  try {
    const { results, hasMore } = await searchFolders(query, parseInt(page, 10), parseInt(limit, 10));
    res.json({ status: true, results, hasMore, msg: '検索に成功しました。' });
  } catch (err: any) {
    res.status(500).json({ status: false, msg: '検索に失敗しました。', error: err.message });
  }
});


expressApp.get('/get_journals_by_month', async (req: any, res: any) => {
  const { month } = req.query; // 例: '2025-01'
  if (!month) {
    return res.status(400).json({ status: false, msg: 'month クエリパラメータが必要です。' });
  }

  try {
    const [year, monthNum] = month.split('-').map(Number);
    if (isNaN(year) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ status: false, msg: '無効な月の形式です。' });
    }

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const docs = await getJournalsByMonth(startDate, endDate);

    res.json({ status: true, docs, msg: '指定された月のジャーナルを取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'データの取得に失敗しました。', error: err.message });
  }
});

// 新しいルート: unchecked items を持つフォルダを取得
expressApp.get('/get_unchecked_items', async (req: any, res: any) => {
  try {
    const folders = await getFoldersWithUncheckedItems();
    res.json({ status: true, folders, msg: 'Unchecked items retrieved successfully.' });
  } catch (err: any) {
    res.json({ status: false, msg: 'Failed to retrieve unchecked items.', error: err.message });
  }
});

export default expressApp;
