import { NOTEBLOCKS } from "@/libs/types/note";
import axios from "axios";

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

const getDataItem = async (m: any) => {
  console.log(m)
  const apiUrl = "http://localhost:8088";
  return await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
    params: {
      id: m.index,
    },
  });
};
export const getData = async (m: any) => {
  const data_item: any = await getDataItem(m);
  console.log(data_item)
  localStorage.removeItem("editorContent");
  if (isEmpty(data_item.data.docs[0].contents)) {
    localStorage.setItem("editorContent", JSON.stringify(""));
    localStorage.setItem("mentionCount", JSON.stringify([]));
  } else {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(data_item.data.docs[0].contents)
    );
    localStorage.setItem(
      "editorContentUpdated",
      JSON.stringify(data_item.data.docs[0].updatedAt)
    );
  }
};