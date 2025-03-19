// =====================================
// routes/services/bots.ts
// =====================================
import express from 'express';
import { 
  addBotCreate,
  addIntent,
  addSynonym,
  deleteBot,
  deleteIntent,
  deleteSynonym,
  getAllBot,
  getAllBotCategory,
  getAllIntents,
  getAllSynonyms,
  getBotAllMessages,
  getIntentsByCategory,
  insertBotCategory,
  updateCategoryBot,
  updateIntent,
  updateQABot,
  updateSynonym,
} from '../database/bot/bot';
//@ts-ignore
import { NlpManager } from "node-nlp"
import kuromoji from 'kuromoji';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from 'electron';
import fs from 'node:fs';
import moji from 'moji';
import Fuse from 'fuse.js';

const expressApp = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeText = (text: string): string => {
  return moji(text)
    .convert('ZE', 'HE')   // 全角英数字→半角
    .convert('ZS', 'HS')   // 全角スペース→半角
    .convert('KK', 'HG')   // カタカナ→ひらがな
    .toString();
};

let fuse: Fuse<any>;
const loadFAQDataForFuse = async () => {
  const bots = await getBotAllMessages();  // DBから全Bot取得
  const questions = bots.flatMap(bot => bot.questions.map(q => ({ question: q, answer: bot.answer })));
  fuse = new Fuse(questions, { keys: ['question'], threshold: 0.4 }); // スコアは0.3〜0.4推奨
};
loadFAQDataForFuse();  // 起動時にFAQをロード

const applySynonyms = async (input: string): Promise<string> => {
  try {
    const synonymData = await getAllSynonyms();
    let expanded = input;
    synonymData.forEach(({ word, synonyms }) => {
      synonyms.forEach((syn) => {
        const regex = new RegExp(`\\b${syn}\\b`, 'g');
        expanded = expanded.replace(regex, word);
      });
    });
    return expanded;
  } catch (err) {
    console.error('Synonym展開エラー:', err);
    return input; // 失敗しても入力はそのまま返す
  }
};


// 環境ごとに適切な辞書パスを設定
const getKuromojiDictPath = () => {
  if (app.isPackaged) {
    const candidatePaths = [
      path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/kuromoji/dict'),
      path.join(process.resourcesPath, 'resources/kuromoji/dict'),
      path.join(process.resourcesPath, 'kuromoji/dict'),
    ];

    for (const candidate of candidatePaths) {
      if (fs.existsSync(candidate)) {
        console.log(`✅ Kuromoji辞書が見つかりました: ${candidate}`);
        return candidate;
      } else {
        console.warn(`❌ Kuromoji辞書が見つかりません: ${candidate}`);
      }
    }
    
    throw new Error('❌ Kuromojiの辞書が見つかりませんでした。');
  } else {
    return path.join(__dirname, '../../node_modules/kuromoji/dict');
  }
};

const kuromojiPath = getKuromojiDictPath();
console.log(`📌 Kuromoji 辞書パス: ${kuromojiPath}`);
/**
 * 形態素解析（kuromoji.js）
 */
const tokenizeJapanese = async (text: string): Promise<string> => {
  console.log(`Using Kuromoji Dictionary Path: ${kuromojiPath}`);

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: kuromojiPath }).build((err, tokenizer) => {
      if (err) {
        reject(new Error(`Kuromoji の初期化に失敗: ${err.message}`));
      } else {
        try {
          const tokens = tokenizer.tokenize(text);
          const filteredTokens = tokens
            .filter(token => !['助詞', '助動詞', '記号'].includes(token.pos))
            .map(token => token.surface_form)
            .join(" ");
          resolve(filteredTokens);
        } catch (tokenizeError: any) {
          reject(new Error(`形態素解析に失敗: ${tokenizeError.message}`));
        }
      }
    });
  });
};

const manager = new NlpManager({
  languages: ['ja'],
  nlu: { useNoneIntent: true },
  tokenizer: {
    ja: { useBest: true, decomposeCompound: true },
  },
  forceNER: true,
});

/**
 * NLPのトレーニングと保存を行う関数をキューに追加
 */
const addToTrainingQueue = async () => {
  // if (!queue.isPaused) {
    // queue が pause されていない場合のみ追加
    // await queue.add(async () => {
      await manager.train();
      await manager.save();
      console.log('NLP Manager がトレーニング＆保存されました。');
    // });
  }
// };

/**
 * サーバー起動時にNLPモデルを初期化＆トレーニング
 */
const initializeNLP = async () => {
  try {
    // 事前にDBから Intent と Bot データをすべて取得
    const intents = await getAllIntents();
    const bots = await getBotAllMessages();

    // NLP Manager に Document と Answer をセット
    for (const intent of intents) {
      // そのインテントに紐づく Bot (QA) を集める
      const relatedBots = bots.filter((bot) => bot.intentId === intent.id);
      for (const bot of relatedBots) {
        // 質問(ユーザ発話)を学習に追加
        // bot.questions.forEach((question) => {
        //   console.log(question,intent.name)
        //   manager.addDocument('ja', question, intent.name);
        // });
        for (const question of bot.questions) {
          const processedQuestion = await tokenizeJapanese(question); // 形態素解析を適用
          console.log(`トークン化された質問: ${processedQuestion}`);
          manager.addDocument('ja', processedQuestion, intent.name);
        }
        // 回答(ボット発話)を学習に追加
        manager.addAnswer('ja', intent.name, bot.answer);
      }
    }
    // モデルをトレーニングして保存
    await manager.train();
    await manager.save();
    console.log(process.resourcesPath, 'kuromoji/dict/')
    console.log('NLP Manager が初期トレーニングされました。');
  } catch (error) {
    console.error('NLP Manager の初期化に失敗:', error);
  }
};
initializeNLP();

// --------------------------------------
// Bot関連API
// --------------------------------------

// すべてのBotを取得（ページネーション対応）
//@ts-ignore
expressApp.get('/get_all_bot', async (req, res) => {
  try {
    const { page = 1, limit = 20 }: any = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ 
        status: false,
        msg: '無効なページ番号またはリミットです。' 
      });
    }

    const data = await getAllBot(pageNum, limitNum);
    res.json({ status: true, data, msg: '検索できました' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

// すべてのボットカテゴリーを取得
expressApp.get('/get_all_bot_category', async (req, res) => {
  try {
    const docs = await getAllBotCategory();
    res.json({ status: true, docs, msg: '検索できました' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

/**
 * 新しいボットを追加
 * DBに登録しつつ、NLPにもドキュメント・回答を追加
 */
expressApp.post('/add_bot_create', async (req, res) => {
  try {
    const {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    } = req.body;
    const botData = {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords: keywords || [],
      relatedFAQs: relatedFAQs || [],
    };
    const newBot = await addBotCreate(botData);

    // NLP Managerにも新規追加
    questions.forEach((question: string) => {
      manager.addDocument('ja', question, intentId);
    });
    manager.addAnswer('ja', intentId, answer);

    // 再トレーニング
    await addToTrainingQueue();

    res.json({ status: true, docs: newBot, msg: 'ボットが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'ボットの作成に失敗しました。', error: err.message });
  }
});

/**
 * ボットを更新
 * 一旦インテントを削除後、再追加する設計の場合、同じインテントIDを
 * 共有している他のBotがあるとそのデータも削除されるリスクがある。
 * ここでは意図的に「Botごとに固有のIntentを持つ」想定で進める。
 */
expressApp.post('/update_qa_bot', async (req, res) => {
  try {
    const {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    } = req.body;

    const updateData = {
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    };

    // DB更新
    const numAffected = await updateQABot(id, updateData);

    // まず既存のインテントを削除
    manager.removeIntent(intentId);
    // 新しい質問と回答を追加
    questions.forEach((question: string) => {
      manager.addDocument('ja', question, intentId);
    });
    manager.addAnswer('ja', intentId, answer);

    // 学習キューに追加
    await addToTrainingQueue();

    res.json({ status: true, numAffected, msg: 'ボットが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'ボットの更新に失敗しました。', error: err.message });
  }
});

/**
 * Bot削除
 * - Bot情報を最初に findOne で取得し、削除実行後に
 *   NLP からもインテントを削除するように修正
 */
//@ts-ignore
expressApp.delete('/delete_bot/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // ---- 1) Bot情報を先に取得する ----
    // 下記のような「getBotById」相当のメソッドを新設し、
    // Bot情報を取り出す方法をおすすめします。
    // 例）
    //   const bot: Bot | null = await getBotById(id);
    //   if (!bot) { ... }

    // あるいは findOne を直接呼び出す形でもOKです。
    // ここでは例として、deleteBotの前に
    // "botDBAsync.findOne({ id })" などを利用する想定で記述します。

    // ここでは便宜上、getBotAllMessages() で全件取得して
    // その中から探す例を記述。
    // 実装環境に合わせて最適化してください。
    const allBots = await getBotAllMessages();
    const bot = allBots.find((b) => b.id === id);

    if (!bot) {
      return res.status(404).json({ status: false, message: 'Botが見つかりませんでした。' });
    }

    // ---- 2) Bot削除 ----
    const numRemoved = await deleteBot(id);
    if (numRemoved <= 0) {
      return res.status(404).json({ status: false, message: 'Botの削除に失敗しました。' });
    }

    // ---- 3) NLP Managerから該当インテントを削除 ----
    // Botごとに固有の Intent であれば削除してOK
    manager.removeIntent(bot.intentId);

    // ---- 4) モデル再学習・保存 ----
    await manager.train();
    await manager.save();

    res.status(200).json({ status: true, message: 'Botが削除されました。' });
  } catch (error) {
    console.error('Botの削除に失敗:', error);
    res.status(500).json({ status: false, message: 'Botの削除に失敗しました。' });
  }
});

// --------------------------------------
// トレーニング手動トリガー
// --------------------------------------
expressApp.post('/train_nlp', async (req, res) => {
  try {
    await addToTrainingQueue();
    res.json({ status: true, msg: 'NLP Manager のトレーニングを開始しました。' });
  } catch (err: any) {
    console.error('NLP Manager のトレーニングに失敗:', err);
    res.status(500).json({ 
      status: false,
      msg: 'NLP Manager のトレーニングに失敗しました。',
      error: err.message 
    });
  }
});

// --------------------------------------
// カテゴリ関連API
// --------------------------------------
expressApp.post('/insert_bot_category', async (req, res) => {
  try {
    const { id, category, color } = req.body;
    const categoryData = { id, category, color };
    const newCategory = await insertBotCategory(categoryData);
    res.json({ status: true, docs: newCategory, msg: 'カテゴリーが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'カテゴリーの作成に失敗しました。', error: err.message });
  }
});

expressApp.post('/update_bot_category', async (req, res) => {
  try {
    const { id, category, color } = req.body;
    const updateData = { category, color };
    const numAffected = await updateCategoryBot(id, updateData);
    res.json({ status: true, numAffected, msg: 'カテゴリーが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'カテゴリーの更新に失敗しました。', error: err.message });
  }
});

// --------------------------------------
// インテント関連API
// --------------------------------------
expressApp.get('/get_all_intents', async (req, res) => {
  try {
    const intents = await getAllIntents();
    res.json({ status: true, intents, msg: 'インテントを取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの取得に失敗しました。', error: err.message });
  }
});

expressApp.get('/get_intents_by_category', async (req, res) => {
  try {
    const { categoryId }: any = req.query; 
    // ↑ req.params ではなく query から取る実装に合わせる場合は要修正
    const intents = await getIntentsByCategory(categoryId);
    res.json({ status: true, intents, msg: 'インテントを取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの取得に失敗しました。', error: err.message });
  }
});

expressApp.post('/add_intent', async (req, res) => {
  try {
    const { id, name, categoryId, description } = req.body;
    const intentData = { id, name, categoryId, description };
    const newIntent = await addIntent(intentData);
    res.json({ status: true, intent: newIntent, msg: 'インテントが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの作成に失敗しました。', error: err.message });
  }
});

expressApp.delete('/delete_intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numRemoved = await deleteIntent(id);
    if (numRemoved > 0) {
      res.json({ status: true, msg: 'インテントが削除されました。' });
    } else {
      res.json({ status: false, msg: '指定されたインテントが見つかりませんでした。' });
    }
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの削除に失敗しました。', error: err.message });
  }
});

expressApp.post('/update_intent', async (req, res) => {
  try {
    const { id, name, categoryId, description } = req.body;
    const updateData = { name, categoryId, description };
    const numAffected = await updateIntent(id, updateData);
    res.json({ status: true, numAffected, msg: 'インテントが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの更新に失敗しました。', error: err.message });
  }
});

// --------------------------------------
// ユーザーメッセージ（チャット）API
// --------------------------------------
//@ts-ignore
expressApp.get('/api/get_bot_message', async (req, res) => {
  const userMessage = req.query.userMessage as string;
  if (!userMessage) {
    return res.status(400).json({
      status: false,
      msg: 'ユーザーメッセージが提供されていません。',
    });
  }

  try {
    console.log(`ユーザーメッセージ受信: ${userMessage}`);

    // === 正規化（moji） ===
    const normalizedMessage = normalizeText(userMessage);
    console.log(`正規化後: ${normalizedMessage}`);

    // ===　類義語化 ===
    const expandedMessage = await applySynonyms(normalizedMessage);
    console.log(`類義語後: ${expandedMessage}`);

    // === 形態素解析（kuromoji） ===
    const processedMessage = await tokenizeJapanese(expandedMessage);
    console.log(`形態素解析後: ${processedMessage}`);

    const response = await manager.process('ja', processedMessage);
    console.log('NLP Response:', response);

    const fallbackResponses = [
      '申し訳ありませんが、よく理解できませんでした。',
      'すみません、その質問にはお答えできません。',
      'ちょっと分かりませんでした。',
      'お手数ですが、もう一度質問してください。',
      'その件についてはよく分かりません。',
    ];

    let botAnswer = '';
    const threshold = 0.90; // しきい値を 0.75 に引き上げ

    if (response.intent && response.score > threshold) {
      botAnswer = response.answer || fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    } else if (response.intent && response.score > 0.5) {
      botAnswer = `もしかして「${response.intent}」について質問していますか？`;
    } else {
      // === NLP低スコア → Fuse.jsでファジーマッチ検索 ===
      console.log('NLP低スコア、fuse.js検索開始');

      const fuseResult = fuse.search(normalizedMessage);
      if (fuseResult.length > 0) {
        botAnswer = `もしかして「${fuseResult[0].item.question}」ですか？\n答え: ${fuseResult[0].item.answer}`;
      } else {
        botAnswer = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }
    }

    res.json({
      status: true,
      answer: botAnswer,
      intent: response.intent,
      score: response.score,
    });
  } catch (error: any) {
    console.error('Botメッセージの取得に失敗:', error);
    res.status(500).json({
      status: false,
      msg: 'Botメッセージの取得に失敗しました。',
      error: error.message,
    });
  }
});

// Synonym一覧取得
expressApp.get('/get_all_synonyms', async (req, res) => {
  try {
    const synonyms = await getAllSynonyms();
    res.json({ status: true, synonyms });
  } catch (err: any) {
    res.json({ status: false, msg: '取得失敗', error: err.message });
  }
});

// Synonym追加
expressApp.post('/add_synonym', async (req, res) => {
  try {
    const { id, word, synonyms } = req.body;
    const newSynonym = await addSynonym({ id, word, synonyms });
    res.json({ status: true, synonym: newSynonym });
  } catch (err: any) {
    res.json({ status: false, msg: '登録失敗', error: err.message });
  }
});

// Synonym 更新API（類義語リストを更新する例）
expressApp.post('/update_synonym', async (req, res) => {
  try {
    const { id, word, synonyms } = req.body;
    const numUpdated = await updateSynonym(id, { word, synonyms });
    if (numUpdated > 0) {
      res.json({ status: true, msg: 'Synonymが更新されました。' });
    } else {
      res.json({ status: false, msg: '更新対象が見つかりませんでした。' });
    }
  } catch (err: any) {
    res.json({ status: false, msg: 'Synonymの更新失敗', error: err.message });
  }
});

// Synonym削除
expressApp.delete('/delete_synonym/:id', async (req, res) => {
  try {
    const numRemoved = await deleteSynonym(req.params.id);
    res.json({ status: numRemoved > 0, msg: numRemoved > 0 ? '削除成功' : '削除失敗' });
  } catch (err: any) {
    res.json({ status: false, msg: '削除失敗', error: err.message });
  }
});

export default expressApp;
