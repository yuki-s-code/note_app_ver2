import { FC, memo } from "react";
import { useAppDispatch, useAppSelector } from "../../../libs/app/hooks";
import {
  resetNoteBlocks,
  selectSearchName,
  setCreateFolderModal,
  setSearchName,
} from "../../../slices/noteSlice";

const NoteSearch: FC = memo(() => {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(selectSearchName);
  const searchOnChange = (e: any) => {
    dispatch(
      setSearchName({
        name: e.target.value,
      })
    );
  };

  const onSearchHandler = () => {
    dispatch(resetNoteBlocks());
    dispatch(
      setCreateFolderModal({
        open: 3,
      })
    );
  };

  return (
    <form className="flex items-center" onClick={onSearchHandler}>
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => searchOnChange(e)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-200 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search...."
        />
      </div>
    </form>
  );
});
export default NoteSearch;
