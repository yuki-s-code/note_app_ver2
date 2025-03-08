//boards.ts

import express from 'express';
import { addBoardComment, boardDeleteFollow, boardFollow, editedBoardComment, editedBoardContents, getAllBoard, getAllBoardHashtag, getBoard, getBoardFavorite, newBoard } from '../database/board/board';

const expressApp = express.Router();

//-----------board------------------------------------------------------
expressApp.get('/get_board', (req: any, res: any) => {
 const { id } = req.query;
 getBoard(id, (err: any, docs: any) => {
   if (err) {
     res.json({ status: false, msg: '検索できませんでした' });
   }
   res.json({ status: true, docs, msg: '検索できました' });
 });
})

expressApp.get('/get_all_board', (req: any, res: any) => {
 const { page } = req.query;
 getAllBoard(page, (err: any, docs: any) => {
   if (err) {
     res.json({ status: false, msg: '検索できませんでした' });
   }
   res.json({ status: true, docs, msg: '検索できました' });
 });
})

expressApp.get('/get_hashtag', (req: any, res: any) => {
 getAllBoardHashtag((err: any, docs: any) => {
   if (err) {
     res.json({ status: false, msg: '検索できませんでした' });
   }
   res.json({ status: true, docs, msg: '検索できました' });
 });
})

expressApp.get('/get_board_favorite', (req: any, res: any) => {
 const { page, user } = req.query;
 getBoardFavorite(page, user, (err: any, docs: any) => {
   if (err) {
     res.json({ status: false, msg: '検索できませんでした' });
   }
   res.json({ status: true, docs, msg: '検索できました' });
 });
})

expressApp.post('/new_board', (req: any, res: any) => {
 const {
   contents,
   user,
   tag,
 } = req.body;
 newBoard(
   contents,
   user,
   tag,
   (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '追加できませんでした' });
       return;
     }
     res.json({ status: true, docs, msg: '追加できました。' });
   });
 })

 expressApp.post('/add_board_comment', (req: any, res: any) => {
   const {
     idx,
     boardComment,
   } = req.body;
   addBoardComment(idx, boardComment, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })
 expressApp.post('/edited_board_comment', (req: any, res: any) => {
   const {
     idx,
     boardComment,
   } = req.body;
   editedBoardComment(idx, boardComment, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })

 expressApp.post('/edited_board_contents', (req: any, res: any) => {
   const {
     contents,
     id,
     tag,
   } = req.body;
   editedBoardContents(contents, id,tag, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })

 expressApp.post('/edited_board_comment', (req: any, res: any) => {
   const {
     contents,
     _id,
   } = req.body;
   editedBoardComment(contents, _id, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })

 expressApp.post('/board_follow', (req: any, res: any) => {
   const {
     boardId,
     user,
   } = req.body;
   boardFollow(boardId, user, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })

 expressApp.post('/board_delete_follow', (req: any, res: any) => {
   const {
     boardId,
     user,
   } = req.body;
   boardDeleteFollow(boardId, user, (err: any, docs: any) => {
     if (err) {
       res.json({ status: false, msg: '検索できませんでした' });
       return
     }
     res.json({ status: true, docs, msg: '検索できました' });
   });
 })

export default expressApp;
