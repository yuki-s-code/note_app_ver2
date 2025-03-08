// server/database/bot/bot.ts
import Datastore from 'nedb';
import path from 'path';
import { fileURLToPath } from "node:url";

const __filename = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.dirname(__filename)

// ── 型定義 ─────────────────────────────────────────────────────────────
export interface Bot {
  id: string;
  category: string[]; // カテゴリーIDまたは名称の配列
  intentId: string;
  questions: string[];
  answer: string;
  keywords: string[];
  relatedFAQs: string[];
}

export interface Category {
  id: string;
  category: string; // カテゴリー名
  color: string;    // カラー情報
}

export interface Intent {
  id: string;
  name: string;      // インテント名
  categoryId: string;
  description?: string;
}

// ── DB 初期化 ─────────────────────────────────────────────────────────────
function initializeDB<T>(filename: string): Datastore<T> {
  return new Datastore<T>({
    filename: path.join(__dirname, filename).replace('app.asar', 'app.asar.unpacked'),
    autoload: true,
    timestampData: true,
    onload: (err: Error | null) => {
      console.log(`${filename} loaded`, err ? `Error: ${err.message}` : 'Success');
    },
  });
}

export const botDB = initializeDB<Bot>('data/bot.db');
export const botCategoryDB = initializeDB<Category>('data/botCategory.db');
export const intentDB = initializeDB<Intent>('data/intent.db');

// ── NeDB の Promise 化 ───────────────────────────────────────────────────
type QueryOptions = { sort?: any; skip?: number; limit?: number };

function promisifyNeDB<T>(db: Datastore<T>) {
  return {
    find: (query: Partial<T>, options: QueryOptions = {}): Promise<T[]> =>
      new Promise((resolve, reject) => {
        let cursor = db.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);
        cursor.exec((err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      }),
    findOne: (query: Partial<T>): Promise<T | null> =>
      new Promise((resolve, reject) => {
        db.findOne(query, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      }),
    insert: (doc: T): Promise<T> =>
      new Promise((resolve, reject) => {
        db.insert(doc, (err, newDoc) => {
          if (err) reject(err);
          else resolve(newDoc);
        });
      }),
    update: (query: Partial<T>, update: Partial<T> | any, options: any = {}): Promise<number> =>
      new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numAffected) => {
          if (err) reject(err);
          else resolve(numAffected);
        });
      }),
    remove: (query: Partial<T>, options: any = {}): Promise<number> =>
      new Promise((resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      }),
    count: (query: Partial<T>): Promise<number> =>
      new Promise((resolve, reject) => {
        db.count(query, (err, count) => {
          if (err) reject(err);
          else resolve(count);
        });
      }),
  };
}

const botDBAsync = promisifyNeDB<Bot>(botDB);
const botCategoryDBAsync = promisifyNeDB<Category>(botCategoryDB);
const intentDBAsync = promisifyNeDB<Intent>(intentDB);

// ── CRUD 関数 ─────────────────────────────────────────────────────────────
// Bot 関連
export const getBotById = async (id: string): Promise<Bot | null> =>
  await botDBAsync.findOne({ id });

export const getAllBot = async (
  page: number,
  limit: number
): Promise<{ docs: Bot[]; total: number; page: number; totalPages: number }> => {
  const skip = (page - 1) * limit;
  const total = await botDBAsync.count({});
  const docs = await botDBAsync.find({}, { skip, limit });
  const totalPages = Math.ceil(total / limit);
  return { docs, total, page, totalPages };
};

export const addBotCreate = async (botData: Bot): Promise<Bot> =>
  await botDBAsync.insert(botData);

export const updateQABot = async (
  id: string,
  updateData: Partial<Bot>
): Promise<number> =>
  await botDBAsync.update({ id }, { $set: updateData }, {});

export const deleteBot = async (id: string): Promise<number> =>
  await botDBAsync.remove({ id }, {});

export const getBotAllMessages = async (): Promise<Bot[]> =>
  await botDBAsync.find({});

// カテゴリ関連
export const insertBotCategory = async (categoryData: Category): Promise<Category> => {
  const existing = await botCategoryDBAsync.findOne({ category: categoryData.category });
  if (existing) throw new Error('このカテゴリーはすでに存在します');
  return await botCategoryDBAsync.insert(categoryData);
};

export const updateCategoryBot = async (
  id: string,
  updateData: Partial<Category>
): Promise<number> =>
  await botCategoryDBAsync.update({ id }, { $set: updateData }, {});

export const getAllBotCategory = async (): Promise<Category[]> =>
  await botCategoryDBAsync.find({});

// インテント関連
export const getAllIntents = async (): Promise<Intent[]> =>
  await intentDBAsync.find({});

export const addIntent = async (intentData: Intent): Promise<Intent> => {
  const existing = await intentDBAsync.findOne({ id: intentData.id });
  if (existing) throw new Error('このインテントIDは既に存在します。');
  return await intentDBAsync.insert(intentData);
};

export const deleteIntent = async (id: string): Promise<number> =>
  await intentDBAsync.remove({ id }, {});

export const getIntentsByCategory = async (categoryId: string): Promise<Intent[]> =>
  await intentDBAsync.find({ categoryId });

export const updateIntent = async (
  id: string,
  updateData: Partial<Intent>
): Promise<number> =>
  await intentDBAsync.update({ id }, { $set: updateData }, {});

// 補助関数：指定 ID のインテントを取得
export const getIntentById = async (id: string): Promise<Intent | null> =>
  await intentDBAsync.findOne({ id });