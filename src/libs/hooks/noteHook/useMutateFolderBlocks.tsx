// useMutateFolderBlocks.tsx

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { format } from "date-fns"; // date-fnsをインポート

const apiUrl = "http://localhost:8088/notes";

// 新しいAxiosインスタンスを作成
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line import/prefer-default-export
export const useMutateFolderBlocks = () => {
  const queryClient = useQueryClient();
  const handleMutation = (
    mutationFn: any,
    getQueryKey: (variables: any) => string[]
  ) => {
    return useMutation(mutationFn, {
      onSuccess: (data, variables) => {
        const queryKey = getQueryKey(variables);
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error: any) => {
        console.error("Mutation error:", error);
        // 必要に応じてユーザーに通知するロジックを追加
      },
    });
  };

  const addRootCreateFolder = handleMutation(
    (folder: any) =>
      axiosInstance.post(`${apiUrl}/add_root_create_folder`, folder),
    () => ["folderBlocks", "tree"]
  );

  const addRootCreateNote = handleMutation(
    (folder: any) =>
      axiosInstance.post(`${apiUrl}/add_root_create_note`, folder),
    () => ["folderBlocks", "tree"]
  );

  const addCreateFolder = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/add_create_folder`, folder),
    () => ["folderBlocks", "tree"]
  );

  const addCreateNote = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/add_create_note`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeNote = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/update_tree`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeIcon = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/update_tree_icon`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeImage = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/update_tree_image`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeBookmarked = handleMutation(
    (folder: any) =>
      axiosInstance.post(`${apiUrl}/update_tree_bookmarks`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeType = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/update_tree_type`, folder),
    () => ["folderBlocks", "tree"]
  );

  const updateTreeSort = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/update_tree_sort`, folder),
    () => ["folderBlocks", "tree"]
  );

  const trashInsert = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/trash_insert`, folder),
    () => ["folderBlocks", "tree"]
  );

  const folderBlocksContentsMutation = handleMutation(
    (folder: any) =>
      axiosInstance.post(`${apiUrl}/edited_folder_contents`, folder),
    () => ["folderBlocks"]
  );

  const dataSheetMutation = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/edited_data_sheet`, folder),
    () => ["folderBlocks"]
  );

  const newBlockMutation = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/new_blocks`, folder),
    () => ["folderBlocks"]
  );

  const selectParentMutation = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/select_parent`, folder),
    () => ["folder"]
  );

  const selectDeleteMutation = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/select_delete`, folder),
    () => ["folder"]
  );

  const addJournalsDataMutation = handleMutation(
    (folder: any) => axiosInstance.post(`${apiUrl}/add_journals`, folder),
    (variables: any) => [
      "folderBlocks",
      "journals",
      format(new Date(variables.uuid), "yyyy-MM"),
    ]
  );

  return {
    addRootCreateFolder,
    addRootCreateNote,
    addCreateFolder,
    addCreateNote,
    updateTreeNote,
    updateTreeIcon,
    updateTreeImage,
    updateTreeBookmarked,
    updateTreeType,
    updateTreeSort,
    trashInsert,
    folderBlocksContentsMutation,
    dataSheetMutation,
    newBlockMutation,
    selectParentMutation,
    selectDeleteMutation,
    addJournalsDataMutation,
  };
};
