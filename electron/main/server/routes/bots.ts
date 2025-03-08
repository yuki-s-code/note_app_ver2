// =====================================
// routes/services/bots.ts
// =====================================
import express from 'express';
import { 
  addBotCreate,
  addIntent,
  deleteBot,
  deleteIntent,
  getAllBot,
  getAllBotCategory,
  getAllIntents,
  getBotAllMessages,
  getIntentsByCategory,
  insertBotCategory,
  updateCategoryBot,
  updateIntent,
  updateQABot,
} from '../database/bot/bot';
//@ts-ignore
import {NlpManager} from "node-nlp"

const expressApp = express.Router();

// --------------------------------------
// NLP Manager & Training Queue
// --------------------------------------
// const queue = new PQueue({ concurrency: 2 });

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
        bot.questions.forEach((question) => {
          console.log(question,intent.name)
          manager.addDocument('ja', question, intent.name);
        });
        // 回答(ボット発話)を学習に追加
        manager.addAnswer('ja', intent.name, bot.answer);
      }
    }
    // モデルをトレーニングして保存
    await manager.train();
    await manager.save();
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
      msg: 'ユーザーメッセージが提供されていません。'
    });
  }

  try {
    // 前処理（形態素解析や正規化など）を強化したい場合はここで実装
    const normalizedMessage = userMessage.trim();

    // NLP に投げる
    const response = await manager.process('ja', normalizedMessage);

    // デバッグ用ログ
    console.log('NLP Response:', response);

    // 複数のフォールバック回答候補
    const fallbackResponses = [
      '申し訳ありませんが、よく理解できませんでした。もう少し詳しく教えていただけますか？',
      'すみません、その質問にはお答えできません。別の質問を試してみてください。',
      'ちょっと分かりませんでした。別の言い方で教えていただけますか？',
      'お手数ですが、もう一度質問していただけますか？',
      'その件についてはよく分かりません。別の質問をお願いします。',
    ];

    let botAnswer = '';
    // ★ 少しスコア閾値を上げるなど調整
    const threshold = 0.60;

    if (response.intent && response.score > threshold) {
      botAnswer = response.answer || '申し訳ありませんが、その質問にはお答えできません。';
    } else {
      // フォールバック回答をランダムに選択
      const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
      botAnswer = fallbackResponses[randomIndex];
    }

    res.json({
      status: true,
      answer: botAnswer,
      intent: response.intent,
      score: response.score,
    });
  } catch (error) {
    console.error('Botメッセージの取得に失敗:', error);
    res.status(500).json({ status: false, msg: 'Botメッセージの取得に失敗しました。' });
  }
});

export default expressApp;