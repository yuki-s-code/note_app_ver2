import { html } from "js-beautify";

export const formatHTML = (htmlString: string) => {
  return html(htmlString, {
    indent_size: 2, // インデント幅
    //@ts-ignore
    space_in_empty_paren: true, // 空の括弧内にスペースを追加
  });
};