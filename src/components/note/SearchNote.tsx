// SearchNote.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogHeader } from "@material-tailwind/react";
import { SearchFuseNote } from "./SearchFuseNote";
import { debounce } from "lodash"; // lodashをインストールして使用

export const SearchNote = ({ open, setOpen }: any) => {
  const [searchText, setSearchText] = useState("");

  const debouncedSetSearchText = useCallback(
    debounce((value: string) => {
      setSearchText(value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchText(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchText.cancel();
    };
  }, [debouncedSetSearchText]);

  const handler = useCallback(() => {
    setOpen(!open);
    setSearchText("");
    // 必要に応じてモーダルリセットのディスパッチを追加
  }, [open, setOpen]);

  return (
    <Dialog
      placeholder="true"
      onPointerEnterCapture
      onPointerLeaveCapture
      open={open}
      handler={handler}
      className=" h-4/6"
    >
      <DialogHeader
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        検索一覧
      </DialogHeader>
      <div className="h-full">
        <div className="flex">
          <input
            className="w-11/12 pl-2 ml-2 mt-2 border-none outline-none text-xl"
            type="text"
            placeholder="あなたのNoteを検索..."
            onChange={handleChange}
          />
        </div>
        <div className="overflow-y-auto">
          <div className="mt-2 h-[360px]">
            <SearchFuseNote searchText={searchText} setOpen={setOpen} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
