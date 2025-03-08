// server/database/login/login.ts

import NeDB from 'nedb';
import path from 'path';
import { fileURLToPath } from "node:url";

const __filename = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.dirname(__filename)

export const userDB = new NeDB({
  filename: path.join(__dirname, 'data/user.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('onload', err);
  },
});

export const getHash = (pw: any) => {
  const salt = '::EVuCMOQwfI48Krpr';
  // eslint-disable-next-line global-require
  const crypto = require('crypto');
  const hashsum = crypto.createHash('sha512');
  hashsum.update(pw + salt);
  return hashsum.digest('hex');
};
export const getAuthToken = (userid: any) => {
  const time = new Date().getTime();
  return getHash(`${userid}:${time}`);
};
export const getUser = (userid: any, callback: any) => {
  userDB.findOne(userid, (err: any, user: any) => {
    if (err || user === null) return callback(null);
    callback(user);
  });
};

export const getMyProfile = (userid: any, callback: any) => {
  userDB.findOne({userid}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const addUser = (userid: any, passwd: any, callback: any) => {
  const hash = getHash(passwd);
  const token = getAuthToken(userid);
  const active = false;
  const profile = "";
  const profiledetail = "";
  const boardfollow: any = [];
  const notefollow: any = [];
  const regDoc = {
    userid,
    hash,
    token,
    active,
    profile,
    profiledetail,
    boardfollow,
    notefollow
  };
  // eslint-disable-next-line consistent-return
  userDB.insert(regDoc, (err: any, _newdoc: any) => {
    if (err) return callback(null);
    callback(token);
  });
};

export const updateUser = (user: any, callback: any) => {
  userDB.update({ userid: user.userid }, user, {}, (err: any, n: any) => {
    if (err) return callback(err, null);
    callback(null);
  });
};

export const login = (userid: any, passwd: any, callback: any) => {
  const hash = getHash(passwd);
  const token = getAuthToken(userid);
  getUser(userid, (user: any) => {
    if (!user || user.hash !== hash) {
      return callback(new Error('認証エラー（ログイン）'), null);
    }
    user.token = token;
    updateUser(user, (err: any) => {
      if (err) return callback(err, null);
      callback(null, token);
    });
  });
};

export const checkToken = (userid: any, token: any, callback: any) => {
  // eslint-disable-next-line consistent-return
  getUser(userid, (user: any) => {
    if (!user || user.token !== token) {
      return callback(new Error('認証に失敗'), null);
    }
    callback(null, user);
  });
};
