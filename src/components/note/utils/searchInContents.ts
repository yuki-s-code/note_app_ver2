export const searchInContent = (content: any, searchText: any) => {
  console.log(content)
  if (!content || !content.length) {
    return false;
  }

  for (const item of content) {
    if (Array.isArray(item.content)) {
      for (const textItem of item.content) {
        if (
          textItem.type === "text" &&
          textItem.text &&
          textItem.text.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return true;
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
            if (
              cellItem.type === "text" &&
              cellItem.text &&
              cellItem.text.toLowerCase().includes(searchText.toLowerCase())
            ) {
              return true;
            }
          }
        }
      }
    }

    if (
      item.children &&
      item.children.length &&
      searchInContent(item.children, searchText)
    ) {
      return true;
    }
  }

  return false;
};