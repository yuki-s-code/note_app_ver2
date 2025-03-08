//NoteTreeCompose.tsx

import {
  Tree,
  ControlledTreeEnvironment,
  TreeItem,
  DraggingPosition,
  DraggingPositionBetweenItems,
  DraggingPositionItem,
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { memo, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetNoteBlocks,
  resetSearchName,
  selectComplexAllFolder,
  selectItemIndex,
  setComplexFolder,
  setItemIndex,
  setTitleId,
  setTreeIdGet,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import { FcDataSheet } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tooltip,
} from "@material-tailwind/react";
import uid from "@/libs/utils/uid";
import { BsTrash } from "react-icons/bs";
import { truncateText } from "./utils/truncateText";
import { getData } from "./utils/getData";
import { notJournalItem } from "./utils/notJournalItem";

export const NoteTreeCompose = memo(() => {
  const dispatch = useAppDispatch();
  const { index } = useAppSelector(selectItemIndex);
  const ic: any = useAppSelector(selectComplexAllFolder);
  const { updateTreeNote, updateTreeSort, trashInsert }: any =
    useMutateFolderBlocks();
  const [focusedItem, setFocusedItem]: any = useState();
  const [expandedItems, setExpandedItems]: any = useState([]);
  const [selectedItems, setSelectedItems]: any = useState([]);
  const { addCreateFolder, addCreateNote }: any = useMutateFolderBlocks();

  const onRenameItem = useCallback(
    (item: TreeItem, name: string) => {
      updateTreeNote.mutate({ index: item.index, data: name });
    },
    [updateTreeNote]
  );

  const onMouse = useCallback(
    (itemIndex: any) => {
      dispatch(setItemIndex({ index: itemIndex }));
    },
    [dispatch]
  );

  // const onDoubleClick = useCallback((e: any, c: any) => {
  //   e.stopPropagation();
  //   c.startRenamingItem();
  // }, []);

  const onClickCreateFolderModal = useCallback(
    (item: any) => {
      dispatch(resetNoteBlocks());
      dispatch(
        setTitleId({
          index: item.index,
          dataItem: item.data.title,
          dataIcon: item.data.icon,
          dataImage: item.data.image,
          dataType: item.data.type,
        })
      );
      dispatch(setItemIndex({ index: item.index }));
    },
    [dispatch]
  );

  const onClickCreateItem = useCallback(
    (item: TreeItem, isFolder: boolean, dataType: string) => {
      const uuid = uid();
      dispatch(
        setComplexFolder({
          index: uuid,
          canMove: true,
          isFolder,
          children: [],
          data: {
            title: "無題",
            icon: isFolder ? "📁" : "📝",
            image: "",
            type: dataType,
          },
          canRename: true,
          roots: !isFolder,
          bookmarks: [],
        })
      );
      dispatch(resetSearchName());
      const mutationData = {
        index: uuid,
        parentId: item.index,
        type: dataType,
      };
      if (isFolder) {
        addCreateFolder.mutate(mutationData);
      } else {
        addCreateNote.mutate(mutationData);
      }
      dispatch(setTreeIdGet({ id: uuid }));
    },
    [dispatch, addCreateFolder, addCreateNote]
  );

  const onClickFolderCreate = useCallback((item: any, dataType: any) => {
    onClickCreateItem(item, true, dataType);
  }, []);

  const onClickNoteCreate = useCallback((item: any, dataType: any) => {
    onClickCreateItem(item, false, dataType);
  }, []);

  const onClickTrashInsert = useCallback((item: any) => {
    trashInsert.mutate({ index: item.index });
  }, []);

  const clearTargetInChildren = useCallback(
    (targetIndex: any) => {
      const objectData: any = {};
      const arrayData: any = [];
      Object.keys(ic).forEach((key: any) => {
        ic[key].children?.filter((child: any) => {
          if (targetIndex.includes(String(child))) {
            arrayData.push(String(child));
            objectData[key] = arrayData;
          }
        });
      });
      console.log(ic, objectData);
      return objectData;
    },
    [ic]
  );

  const onDropBetweenItems = useCallback(
    async (
      items: any[],
      target: DraggingPositionBetweenItems
      // fileTree: RevezoneFileTree
    ) => {
      const itemIds: string[] = items
        .map((item) => item.index)
        .filter((id) => !!id);
      console.log(itemIds);
      const fileTree = clearTargetInChildren(itemIds);
      console.log(fileTree);
      updateTreeSort.mutate({
        index: "index",
        target: target.parentItem,
        data: itemIds,
        parent: "parent",
        fileTree,
      });
    },
    []
  );

  const onDropItem = useCallback(
    async (items: any[], target: DraggingPositionItem) => {
      const itemIds: string[] = items
        .map((item) => item.index)
        .filter((id) => !!id);
      console.log(itemIds);
      const fileTree = clearTargetInChildren(itemIds);
      updateTreeSort.mutate({
        index: "index",
        target: target.targetItem,
        data: itemIds,
        parent: "parent",
        fileTree,
      });
    },
    [clearTargetInChildren, updateTreeSort]
  );

  const onDrop = useCallback(
    async (items: TreeItem[], target: DraggingPosition) => {
      switch (target.targetType) {
        case "between-items":
          onDropBetweenItems(items, target);
          break;
        case "item":
          onDropItem(items, target);
          break;
        case "root":
          break;
      }
    },
    [onDropBetweenItems, onDropItem]
  );

  if (!ic) return null;
  if (ic) {
    return (
      <div className="revezone-menu-container w-[calc(100%-0rem)] z-0">
        <div className="menu-list border-slate-100 px-1 pt-2">
          <ControlledTreeEnvironment
            items={notJournalItem(ic)}
            // items={ic}
            getItemTitle={(item) => item.data.title}
            canDragAndDrop={true}
            canDropOnFolder={true}
            canReorderItems={true}
            viewState={{
              ["revezone-file-tree"]: {
                focusedItem,
                expandedItems,
                selectedItems,
              },
            }}
            onFocusItem={(item: any) => setFocusedItem(item.index)}
            onExpandItem={(item: any) =>
              setExpandedItems([...expandedItems, item.index])
            }
            onCollapseItem={(item: any) =>
              setExpandedItems(
                expandedItems.filter(
                  (expandedItemIndex: any) => expandedItemIndex !== item.index
                )
              )
            }
            onSelectItems={(items: any) => setSelectedItems(items)}
            renderTreeContainer={({ children, containerProps }) => (
              <div {...containerProps}>{children}</div>
            )}
            renderItemsContainer={({ children, containerProps }) => (
              <ul {...containerProps}>{children}</ul>
            )}
            onDrop={onDrop}
            onRenameItem={(item: any, name: any) => onRenameItem(item, name)}
            renderItem={({
              item,
              depth,
              children,
              title,
              context,
              arrow,
            }: any) => {
              const InteractiveComponent = context.isRenaming
                ? "div"
                : "button";
              const type = context.isRenaming ? undefined : "button";

              return (
                <li
                  {...context.itemContainerWithChildrenProps}
                  className="rct-tree-item-li"
                >
                  <div
                    {...context.itemContainerWithoutChildrenProps}
                    style={{ paddingLeft: `${(depth + 1) * 0.5}rem` }}
                    className={[
                      "rct-tree-item-title-container",
                      item.isFolder && "rct-tree-item-title-container-isFolder",
                      context.isSelected &&
                        "rct-tree-item-title-container-selected",
                      context.isExpanded &&
                        "rct-tree-item-title-container-expanded",
                      context.isFocused &&
                        "rct-tree-item-title-container-focused",
                      context.isDraggingOver &&
                        "rct-tree-item-title-container-dragging-over",
                      context.isSearchMatching &&
                        "rct-tree-item-title-container-search-match",
                    ].join(" ")}
                  >
                    {arrow}
                    <InteractiveComponent
                      // @ts-ignore
                      type={type}
                      {...context.interactiveElementProps}
                      className="rct-tree-item-button flex justify-between items-center"
                      onMouseOver={() => onMouse(item.index)}
                    >
                      <div>
                        <div
                          className={`flex justify-between items-center flex-1 menu-tree-item-child w-11/12 ${item.index}`}
                        >
                          <div className=" flex w-40">
                            <div className="flex items-center">
                              {item.data.type === "folder" ? (
                                // context.isExpanded ? (
                                //   <FcOpenedFolder className="w-4 h-4" />
                                // ) : (
                                //   <FcFolder className="w-4 h-4" />
                                // )
                                <div className=" -mt-1 w-4 h-4">
                                  {item.data.icon}
                                </div>
                              ) : item.data.type === "note" ? (
                                <div className=" -mt-1 w-4 h-4">
                                  {item.data.icon}
                                </div>
                              ) : (
                                <FcDataSheet className=" w-4 h-4" />
                              )}
                            </div>
                            <Link to={`/root/note/${index}`}>
                              <div
                                className="ml-1 truncate pr-2 text-sm text-blue-gray-500"
                                onClick={() => {
                                  onClickCreateFolderModal(item),
                                    getData(item),
                                    console.log(item);
                                }}
                                onDragEnter={() => {
                                  onClickCreateFolderModal(item), getData(item);
                                }}
                              >
                                {title ? truncateText(title, 10) : "無題"}
                              </div>
                            </Link>
                            <div className="z-20 absolute right-3 mt-1">
                              {index == item.index && item.isFolder ? (
                                <Tooltip content="作成,削除...">
                                  <Menu>
                                    <MenuHandler>
                                      <div
                                        className="cursor-pointer"
                                        // variant="text"
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
                                            fill="#90A4AE"
                                          />
                                        </svg>
                                      </div>
                                    </MenuHandler>
                                    <MenuList
                                      placeholder="true"
                                      onPointerEnterCapture
                                      onPointerLeaveCapture
                                      className=""
                                    >
                                      <MenuItem
                                        placeholder="true"
                                        onPointerEnterCapture
                                        onPointerLeaveCapture
                                        onClick={() =>
                                          onClickFolderCreate(item, "folder")
                                        }
                                      >
                                        フォルダーを作成
                                      </MenuItem>
                                      <MenuItem
                                        placeholder="true"
                                        onPointerEnterCapture
                                        onPointerLeaveCapture
                                        onClick={() => {
                                          onClickNoteCreate(item, "note"),
                                            setItemIndex(item.index);
                                        }}
                                      >
                                        ノートを作成
                                      </MenuItem>
                                      <MenuItem
                                        placeholder="true"
                                        onPointerEnterCapture
                                        onPointerLeaveCapture
                                        onClick={() => {
                                          onClickNoteCreate(item, "sheet"),
                                            setItemIndex(item.index);
                                        }}
                                      >
                                        データシートを作成
                                      </MenuItem>

                                      <hr className="my-3" />
                                      <MenuItem
                                        placeholder="true"
                                        onPointerEnterCapture
                                        onPointerLeaveCapture
                                        className=" flex"
                                      >
                                        <BsTrash className=" h-4 w-4" />
                                        <div className=" ml-2">削除</div>
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Tooltip>
                              ) : null}
                              {index == item.index && !item.isFolder ? (
                                <Tooltip content="削除...">
                                  <Menu>
                                    <MenuHandler>
                                      <div
                                        className="cursor-pointer"
                                        // variant="text"
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
                                            fill="#90A4AE"
                                          />
                                        </svg>
                                      </div>
                                    </MenuHandler>
                                    <MenuList
                                      placeholder="true"
                                      onPointerEnterCapture
                                      onPointerLeaveCapture
                                    >
                                      <MenuItem
                                        placeholder="true"
                                        onPointerEnterCapture
                                        onPointerLeaveCapture
                                        className=" flex"
                                        onClick={() => onClickTrashInsert(item)}
                                      >
                                        <BsTrash className=" h-4 w-4" />
                                        <div className=" ml-2">削除</div>
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Tooltip>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </InteractiveComponent>
                  </div>
                  {children}
                </li>
              );
            }}
          >
            <Tree
              treeId="revezone-file-tree"
              rootItem="root"
              treeLabel="FileTree"
            />
          </ControlledTreeEnvironment>
        </div>
      </div>
    );
  }
  return null;
});
