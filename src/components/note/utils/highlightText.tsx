// highlightText.tsx

import React, { JSX } from "react";

/**
 * テキスト内の検索キーワードをハイライトします。
 *
 * @param {string} text - ハイライト対象のテキスト。
 * @param {string} searchText - ハイライトするキーワード。
 * @returns {JSX.Element} - ハイライトされたテキストを含むJSX要素。
 */
export const highlightText = (
  text: string,
  searchText: string
): JSX.Element => {
  if (!searchText) {
    return <span>{text}</span>;
  }
  // 正規表現を使用してキーワードを大文字小文字を区別せずに検索
  const regex = new RegExp(`(${escapeRegExp(searchText)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ fontWeight: "bold", color: "orange" }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

/**
 * 正規表現の特殊文字をエスケープします。
 *
 * @param {string} string - エスケープする文字列。
 * @returns {string} - エスケープされた文字列。
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
