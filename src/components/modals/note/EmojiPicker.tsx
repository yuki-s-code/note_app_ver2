// EmojiPicker.tsx

import { KeyboardEvent, useState } from "react";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

// ピッカーのアニメーションバリアント
const pickerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

// アイコンのアニメーションバリアント
const iconVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.9 },
};

const EmojiPicker = ({ icon, onChange, sideItem }: any) => {
  const [isShowPicker, setIsShowPicker] = useState(false);
  const togglePicker = () => setIsShowPicker((prev) => !prev);

  const showPicker = () => setIsShowPicker((prev) => !prev);

  const selectEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    const emoji = emojiData.emoji;
    setIsShowPicker(false);
    onChange(emoji);
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePicker();
    }
  };

  return (
    <>
      <motion.div
        className={
          sideItem
            ? "relative text-8xl -ml-24 w-24 h-24 cursor-pointer"
            : "relative text-8xl w-24 h-24 cursor-pointer"
        }
        onClick={showPicker}
        variants={iconVariants}
        initial="initial"
        whileTap="tap"
        aria-label="Select Emoji"
        role="button"
        tabIndex={0}
        onKeyPress={handleKeyPress}
      >
        {icon}
      </motion.div>
      <AnimatePresence>
        {isShowPicker && (
          <motion.div
            className="absolute z-50 mt-2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pickerVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <EmojiPickerReact onEmojiClick={selectEmoji} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmojiPicker;
