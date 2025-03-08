// types.ts

export interface NGram {
  [key: string]: number;
}

export interface Category {
  id: string;
  category: string;
  color: string;
}

export interface Intent {
  id: string;
  name: string; // インテント名
  categoryId: string; // 関連するカテゴリーのID
  description?: string; // インテントの説明（任意）
}

export interface FAQ {
  questions: string[];
  answer: string;
}

export interface QAPair {
  questions: string[];
  answers: string[];
  category: string[]; // string[]に統一
}

export interface QAPairWithEmbeddings extends QAPair {
  questionEmbeddings: number[][];
}

export interface Option {
  label: string;
  value: string;
}

export interface CheckboxItem {
  label: string;
  value: string;
}

export interface Timestamp {
  date: string;
  time: string;
}

export interface Checkboxes {
  items: CheckboxItem[];
  min: number;
}

export interface ModelStyle {
  id: string;
  path: "bot" | "user";
  category: string[]; // Category[]からstring[]に変更
  intentId: string;
  questions: string[];
  answer: string;
  keywords: string[]; // null を除去し、空配列で対応
  relatedFAQs: FAQ[];
  timestamp: Timestamp;
}

export interface TensorflowResult {
  topAnswersWithScores: { score: number; answer: string }[];
}