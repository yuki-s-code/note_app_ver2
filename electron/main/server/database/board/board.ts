
import NeDB from 'nedb';
import path from 'path';
import { fileURLToPath } from "node:url";

const __filename = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.dirname(__filename)

export const boardDB = new NeDB({
  filename: path.join(__dirname, 'data/board.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('boardDB start', err);
  },
});

export const getBoard = (id: string, callback: any) => {
  boardDB.find({ _id: id }, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getAllBoard = (page: number, callback: any) => {
  boardDB.find({}).sort({createdAt: -1}).skip(0).limit(page).exec((err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getAllBoardHashtag = (callback: any) => {
  boardDB.find({}),(err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  };
};

export const getBoardFavorite = (page: number, user: any, callback: any) => {
  boardDB.find({ favorite: { $in : [ user ] }},(err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const newBoard = (
  contents: any,
  user: string,
  tag: any,
  callback: any
) => {
  const regDoc = {
    display: true,
    contents,
    comment:[],
    user,
    tag,
    favorite:[],
  };
  boardDB.insert(regDoc, (err: any, newdoc: any) => {
        if (err) return callback(null);
        callback(null, newdoc);
      })
    }

export const editedBoardContents = (contents: any, id: any, tag: any, callback: any) => {
  const update = {
    $set: { contents, tag },
  };
  boardDB.update({ _id: id }, update, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(null, newdoc);
  });
};

  

export const editedBoardComment = (
  idx: any,
  boardComment: any,
  callback: any) => {
  const update = {
    $set: { comment: [boardComment] },
  };
  boardDB.update({ _id: idx }, update, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
};

export const addBoardComment = (
  idx: any,
  boardComment: any,
  callback: any
  ) => {
  const update = {
    $push: { comment: boardComment },
  };
  boardDB.update({ _id: idx }, update, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
};

export const boardFollow = (
  boardId: any,
  user: string,
  callback: any
) => {
  const update = {
    $addToSet: { favorite:  user },
  };
  boardDB.update({_id: boardId}, update, {}, (err: any, newdocs: any) => {
    if (err) return callback(null);
    callback(null, newdocs);
  });
};

export const boardDeleteFollow = (
  boardId: any,
  user: string,
  callback: any
) => {
  const update = {
    $pull: { favorite:  user },
  };
  boardDB.update({_id: boardId}, update, {}, (err: any, newdocs: any) => {
    if (err) return callback(null);
    callback(null, newdocs);
  });
};
