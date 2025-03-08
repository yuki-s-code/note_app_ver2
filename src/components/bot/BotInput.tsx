// BotInput.tsx

import { Textarea, IconButton } from "@material-tailwind/react";
import { dateNavigation, timeNavigation } from "../note/utils/dateNavigation";
import React, { useCallback } from "react";
import { ModelStyle } from "./types/types";
import { useMutateBotMessage } from "@/libs/hooks/noteHook/useQueryBot";

interface BotInputProps {
  searchItem: string;
  setSearchItem: (value: string) => void;
  modelItem: ModelStyle[];
  setModelItem: (items: ModelStyle[]) => void;
  setEnterButton: (value: boolean) => void;
}

export const BotInput: React.FC<BotInputProps> = ({
  searchItem,
  setSearchItem,
  modelItem,
  setModelItem,
  setEnterButton,
}) => {
  const mutateBotMessage = useMutateBotMessage();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSearchItem(e.target.value);
    },
    [setSearchItem]
  );

  const handleSend = useCallback(() => {
    if (!searchItem.trim()) return; // 空入力の防止

    // ユーザーメッセージの追加
    const newUserMessage: ModelStyle = {
      id: Date.now().toString(),
      path: "user",
      category: [],
      intentId: "",
      questions: [searchItem],
      answer: "",
      keywords: [],
      relatedFAQs: [],
      timestamp: { date: dateNavigation(), time: timeNavigation() },
    };

    // modelItem にユーザーメッセージを追加
    setModelItem([...modelItem, newUserMessage]);
    setEnterButton(true);
    setSearchItem(""); // 入力フィールドをクリア

    // APIからBotの回答を取得
    mutateBotMessage.mutate(searchItem, {
      onSuccess: (data) => {
        const botAnswer = data.answer || "回答が見つかりませんでした。";

        const newBotMessage: ModelStyle = {
          id: (Date.now() + 1).toString(),
          path: "bot",
          category: [],
          intentId: data.intent || "",
          questions: [],
          answer: botAnswer,
          keywords: [],
          relatedFAQs: [],
          timestamp: { date: dateNavigation(), time: timeNavigation() },
        };

        // modelItem にBotの回答を追加
        //@ts-ignore
        setModelItem((prevItems) => [...prevItems, newBotMessage]);
      },
      onError: (error: any) => {
        console.error("Botの回答取得に失敗しました:", error);
      },
    });
  }, [
    searchItem,
    modelItem,
    setModelItem,
    mutateBotMessage,
    setEnterButton,
    setSearchItem,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex w-[420px] flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-10/5 p-2">
      <Textarea
        onPointerEnterCapture
        onPointerLeaveCapture
        rows={1}
        resize={true}
        value={searchItem}
        onChange={handleInputChange}
        placeholder="ここに入力してください"
        className="min-h-full !border-0 focus:border-transparent"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        onKeyPress={handleKeyPress}
        aria-label="入力フィールド"
      />
      <IconButton
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
        variant="text"
        className="rounded-full"
        onClick={handleSend}
        aria-label="送信"
      >
        {/* 送信アイコン */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </IconButton>
    </div>
  );
};
