interface DocumentData {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: {
    title: string;
    icon: string;
    image: string;
    type: string;
  };
  canRename: boolean;
  bookmarks?: string[];
}
interface Document {
  [index: string]: DocumentData;
}

export const convertToIndexTitles = (
    documentData: Document
  ): { index: string; title: string,icon: any, image: any, type: any }[] => {
    const result: { index: string; title: string; icon: any; image: any; type: any }[] = [];
    for (const [index, data] of Object.entries(documentData)) {
      // if (!data.isFolder) {
        if (index !== "root") {
        result.push({
          index,
          title: data.data.title,
          icon: data.data.icon,
          image: data.data.image,
          type: data.data.type,
        });
      }
    }
  return result;
}