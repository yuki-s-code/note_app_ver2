import { useCallback } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetNoteBlocks,
  selectComplexAllFolder,
  selectItemIndex,
  setCreateFolderModal,
  setItemIndex,
  setTitleId,
} from "@/slices/noteSlice";
import { BookmarkIcon } from "lucide-react";
import { getData } from "./utils/getData";
import { Link } from "react-router-dom";

export const BookmarkList = () => {
  const dispatch = useAppDispatch();
  const ic: any = useAppSelector(selectComplexAllFolder);
  const userId = window.localStorage.sns_id;
  const { index } = useAppSelector(selectItemIndex);
  const listFilterItem: any = useCallback(() => {
    const filteredData: any = Object.values(ic).filter(
      (item: any) => item.bookmarks && item.bookmarks.includes(userId)
    );
    return filteredData;
  }, [ic]);

  const onClickCreateFolderModal = useCallback(
    (n: any, m: any, i: any) => {
      dispatch(resetNoteBlocks());
      dispatch(
        setTitleId({
          index: m.index,
          dataItem: m.data.title,
          dataIcon: m.data.icon,
          dataImage: m.data.image,
          dataType: m.data.type,
        })
      );
      dispatch(
        setItemIndex({
          index: m.index,
        })
      );
      dispatch(
        setCreateFolderModal({
          open: n,
        })
      );
    },
    [ic]
  );

  const onMouse = useCallback((e: any) => {
    dispatch(
      setItemIndex({
        index: e,
      })
    );
  }, []);

  return (
    <Card
      className="w-48 border-none shadow-none"
      placeholder="true"
      onPointerEnterCapture
      onPointerLeaveCapture
    >
      <List placeholder="true" onPointerEnterCapture onPointerLeaveCapture>
        {listFilterItem().map((list: any, i: any) => (
          <Link
            key={i}
            to={`/root/note/${index}`}
            onClick={() => {
              onClickCreateFolderModal(2, list, list.id), getData(list);
            }}
            onMouseOver={() => onMouse(list.index)}
          >
            <ListItem
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              className="-p-4"
            >
              <ListItemPrefix
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                <BookmarkIcon color="#3e9392" className=" h-4 w-4" />
              </ListItemPrefix>
              <div className=" -ml-2">
                <Typography
                  placeholder="true"
                  onPointerEnterCapture
                  onPointerLeaveCapture
                  className=" text-sm text-blue-gray-600"
                >
                  {list.data.title}
                </Typography>
              </div>
            </ListItem>
          </Link>
        ))}
      </List>
    </Card>
  );
};
