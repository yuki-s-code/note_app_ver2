// BotTop.tsx

import { VscFoldDown } from "react-icons/vsc";
import { Tooltip } from "@material-tailwind/react";
import React, { useCallback, useState } from "react";
import { BotInput } from "./BotInput";
import { motion, AnimatePresence } from "framer-motion";
import { BotMain } from "./BotMain";
import { BotIcon } from "./BotIcon";
import { PencilIcon } from "lucide-react";
import { ModelStyle } from "./types/types";

interface BotTopProps {
  editedOpen: boolean;
  setEditedOpen: (open: boolean) => void;
}

export const BotTop: React.FC<BotTopProps> = ({
  editedOpen,
  setEditedOpen,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [modelItem, setModelItem] = useState<ModelStyle[]>([]);
  const [enterButton, setEnterButton] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const handleClose = useCallback(() => {
    setSearchItem("");
    setModelItem([]);
    setModalOpen(false);
    setEnterButton(false);
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <AnimatePresence>
        {!modalOpen ? (
          <Tooltip content="私はユニバーです">
            <motion.div
              className="cursor-pointer -mt-14"
              onClick={() => setModalOpen(true)}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <BotIcon />
            </motion.div>
          </Tooltip>
        ) : (
          <motion.div
            className="w-[450px] h-[640px] bg-white shadow-md border rounded-3xl overflow-hidden flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="p-4 ml-2 flex justify-between">
              <div className="flex">
                <div className="-mt-3">
                  <BotIcon />
                </div>
                <div className="ml-8 mt-2 font-bold text-lg text-gray-600">
                  ユニバー アシスタント
                </div>
                <div
                  className="ml-8 mt-2 font-bold text-lg text-gray-600 cursor-pointer hover:text-gray-800"
                  onClick={() => setEditedOpen(!editedOpen)}
                  aria-label="編集ボタン"
                >
                  <PencilIcon />
                </div>
              </div>
              <div onClick={handleClose} aria-label="閉じるボタン">
                <VscFoldDown
                  size={20}
                  className="mt-4 text-gray-400 cursor-pointer hover:text-gray-800"
                />
              </div>
            </div>
            <div className="border-b-2 border-gray-100 w-10/12 ml-8" />
            <div className="flex-1 overflow-y-auto hover-scrollbar">
              <BotMain modelItem={modelItem} />
            </div>
            <div className="p-4">
              <BotInput
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                modelItem={modelItem}
                setModelItem={setModelItem}
                setEnterButton={setEnterButton}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
