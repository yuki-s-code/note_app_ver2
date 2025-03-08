// Drawer.tsx

import React from "react";
import { useAppSelector } from "@/libs/app/hooks";
import { selectMentionBlock } from "@/slices/noteSlice";
import DrawerSheetTop from "./sheet/DrawerSheetTop";
import { DrawerTop } from "./DrawerTop";

const Drawer: React.FC = () => {
  const { mentionType } = useAppSelector(selectMentionBlock);

  return (
    <div>{mentionType === "sheet" ? <DrawerSheetTop /> : <DrawerTop />}</div>
  );
};

export default Drawer;
