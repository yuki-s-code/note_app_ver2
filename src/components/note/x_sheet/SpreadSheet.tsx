import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import { SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import XSpreadsheet from "x-data-spreadsheet";
import "x-data-spreadsheet/dist/xspreadsheet.css";

export default function Spreadsheet(props: any) {
  const sheetEl: any = useRef(null);
  const sheetRef: any = useRef(null);
  const [state, setState] = useState(props.data || {});
  const { dataSheetMutation }: any = useMutateFolderBlocks();

  useEffect(() => {
    const element: any = sheetEl.current;
    const sheet: any = new XSpreadsheet("#x-spreadsheet-demo", {
      view: {
        height: () =>
          (element && element.clientHeight) ||
          document.documentElement.clientHeight,
        width: () =>
          (element && element.clientWidth) ||
          document.documentElement.clientWidth,
      },
      ...props.options,
    })
      .loadData(state) // load data
      .change((data) => {
        setState(data);
      });

    sheetRef.current = sheet;
    return () => {
      element.innerHTML = "";
    };
  }, [props.options]);

  const onClickSave = (s: any) => {
    localStorage.setItem("dataSheetContent", s);
    dataSheetMutation.mutate({
      id: props.noteId,
      contents: JSON.parse(s),
    });
  };

  return (
    <>
      <div>
        <div onClick={() => onClickSave(JSON.stringify(state))}>
          <SaveIcon className=" text-gray-500 mt-2 ml-1 absolute cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      <div
        style={{ height: props.height || "100%", width: props.width || "100%" }}
        id="x-spreadsheet-demo"
        ref={sheetEl}
      ></div>
      {/* {JSON.stringify(state)} */}
    </>
  );
}
