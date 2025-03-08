//auth.ts

import express from 'express';
import { login, addUser, getMyProfile, getUser, updateUser, checkToken } from '../database/login/login';

const expressApp = express.Router();

expressApp.get('/login', (req: any, res: any) => {
  const { userid, passwd } = req.query;
  login(userid, passwd, (err: any, token: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, token, msg: '認証できました' });
  });
});

expressApp.get('/get_user', (req: any, res: any) => {
  const { userid } = req.query;
  getMyProfile(userid, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, docs, msg: '認証できました' });
  });
});

// eslint-disable-next-line consistent-return
expressApp.post('/adduser', (req: any, res: any) => {
  const { userid, passwd } = req.body;
  if (userid === '' || passwd === '') {
    return res.json({ status: false, msg: 'パラメーターが空です' });
  }
  getUser(userid, (user: any) => {
    if (user) {
      return res.json({ status: false, msg: 'すでにユーザーがいます' });
    }
    addUser(userid, passwd, (token: any) => {
      if (!token) {
        res.json({ status: false, msg: 'DBのエラー' });
      }
      res.json({ status: true, token, msg: '登録できました' });
    });
  });
});

expressApp.post("/api/user_updated", (req, res) => {
  const { user } = req.query;
  updateUser(user, (err: any, token: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, token, msg: '認証できました' });
  });
});

expressApp.get("/api/add_friend", (req, res) => {
  const { userid, token, friendid }: any = req.query
  checkToken(userid, token, (err: any, user: any) => {
    if (err) {
      res.json({ status: false, msg: "認証エラー" });
      return;
    }
    user.friends[friendid] = true;
    updateUser(user, (err: any) => {
      if (err) {
        res.json({ status: false, msg: "DBエラー" });
        return;
      }
      res.json({ status: true });
    });
  });
});

export default expressApp;
