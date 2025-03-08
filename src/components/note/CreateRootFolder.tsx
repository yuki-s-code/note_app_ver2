import { FC, memo, useCallback } from "react";
import {
  resetSearchName,
  setComplexFolder,
  selectComplexFolder,
  setTreeIdGet,
  setNoteBlocks,
} from "../../slices/noteSlice";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import uid from "../../libs/utils/uid";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import { FcFolder, FcDocument, FcDataSheet } from "react-icons/fc";

const CreateRootFolder: FC = memo(() => {
  const dispatch = useAppDispatch();
  const items: any = useAppSelector(selectComplexFolder);

  const { addRootCreateFolder, addRootCreateNote }: any =
    useMutateFolderBlocks();

  const submitItemHandler = useCallback(
    (isFolder: any, dataType: any) => {
      const uuid = uid();
      dispatch(
        setComplexFolder({
          index: uuid,
          canMove: true,
          isFolder: isFolder,
          children: [],
          data: {
            title: "無題",
            icon: isFolder ? "📁" : "📝",
            image: "",
            type: dataType,
          },
          canRename: true,
          roots: true,
          bookmarks: [],
        })
      );
      dispatch(resetSearchName());
      if (isFolder) {
        addRootCreateFolder.mutate({ items, uuid, type: dataType });
      } else {
        addRootCreateNote.mutate({ items, uuid, type: dataType });
      }
      dispatch(
        setTreeIdGet({
          id: uuid,
        })
      );
      dispatch(
        setNoteBlocks({
          id: uuid,
          contents: {},
          pageLinks: [],
          user: "all",
        })
      );
    },
    [dispatch, addRootCreateFolder, addRootCreateNote, items]
  );

  const submitFolderHandler = useCallback(() => {
    submitItemHandler(true, "folder");
  }, []);

  const submitNoteHandler = useCallback(() => {
    submitItemHandler(false, "note");
  }, []);
  const submitSheetHandler = useCallback(() => {
    submitItemHandler(false, "sheet");
  }, []);

  return (
    <div className=" w-28 bg-transparent rounded-lg text-gray-400 font-bold ml-4 mt-4">
      <div className=" flex">
        <FcFolder
          onClick={() => {
            submitFolderHandler();
          }}
          className=" text-2xl cursor-pointer hover:opacity-80 opacity-40 "
        />
        <FcDocument
          onClick={() => {
            submitNoteHandler();
          }}
          className=" text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
        />
        <FcDataSheet
          onClick={() => {
            submitSheetHandler();
          }}
          className=" text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
        />
      </div>
    </div>
  );
});
export default CreateRootFolder;
