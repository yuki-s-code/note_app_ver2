// dateUtils.ts

import { format, subDays, addDays } from 'date-fns';

/**
 * 指定された日付を 'yyyy-MM-dd' 形式にフォーマットします。
 * @param date - フォーマットする日付。
 * @returns フォーマットされた日付文字列。
 */
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * 今日の日付を 'yyyy-MM-dd' 形式で返します。
 * @returns 今日の日付文字列。
 */
export const dateNavigation = (): string => {
  return formatDate(new Date());
};

/**
 * 明日の日付を 'yyyy-MM-dd' 形式で返します。
 * @returns 明日の日付文字列。
 */
export const tomorrowNavigation = (): string => {
  const tomorrow = addDays(new Date(), 1);
  return formatDate(tomorrow);
};

/**
 * 昨日の日付を 'yyyy-MM-dd' 形式で返します。
 * @returns 昨日の日付文字列。
 */
export const yesterdayNavigation = (): string => {
  const yesterday = subDays(new Date(), 1);
  return formatDate(yesterday);
};

/**
 * 現在の時刻を 'HH:mm' 形式で返します（タイムゾーンは 'Asia/Tokyo'）。
 * @returns 現在の時刻文字列。
 */
export const timeNavigation = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24時間形式
  };
  const formatter = new Intl.DateTimeFormat("ja-JP", options);
  return formatter.format(new Date());
};