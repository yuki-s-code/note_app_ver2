export const extractTextById = (data: any) => {
  const result: any = {};

  const extractTextFromContent = (content: any): string[] => {
    let extractedText: string[] = [];

    if (!content || !content.length) {
      return extractedText;
    }

    for (const item of content) {
      if (Array.isArray(item.content)) {
        for (const textItem of item.content) {
          if (textItem.type === "text" && textItem.text) {
            extractedText.push(textItem.text);
          }
        }
      } else if (item.type === "table") {
        const tableContent = item.content as {
          type: string;
          rows: { cells: any[][] }[];
        };

        for (const row of tableContent.rows) {
          for (const cell of row.cells) {
            for (const cellItem of cell) {
              if (cellItem.type === "text" && cellItem.text) {
                extractedText.push(cellItem.text);
              }
            }
          }
        }
      }

      if (item.children && item.children.length) {
        extractedText = extractedText.concat(
          extractTextFromContent(item.children)
        );
      }
    }

    return extractedText;
  };
    for (const item of data) {
      const textArray = extractTextFromContent(item.contents);
      result[item.id] = textArray;

  }

  return result;
};