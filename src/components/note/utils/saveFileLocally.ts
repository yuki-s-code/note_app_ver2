  // **ファイルをローカルに保存する関数**
  export const saveFileLocally: any = async (file: File) => {
    try {
      // Electron の IPC を使ってメインプロセスにリクエストを送る
      //@ts-ignore
      const filePath = await window.electron.saveFile(file);
      return `file://${filePath}`; // 保存したファイルのローカルURLを返す
    } catch (error) {
      console.error("ファイル保存エラー:", error);
      return null;
    }
  };