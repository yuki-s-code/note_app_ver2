//useMutateBot.tsx

import { ModelStyle } from "@/components/bot/types/types";
import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

const apiUrl = "http://localhost:8088/bots";

// 新しいAxiosインスタンスを作成
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:8088", // バックエンドのオリジンに合わせて設定
  },
});

export const useMutateBot = () => {
  const queryClient = useQueryClient();
  const addBotCategory = useMutation(
    (folder: ModelStyle) =>
      axiosInstance.post(`${apiUrl}/insert_bot_category`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["bot", "category"] });
      },
      onError: (error: any) => {
        console.error("カテゴリーの追加に失敗しました:", error);
      },
    }
  );
  const addBot = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_bot_create`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["bot"] });
      },
      onError: (error: any) => {
        console.error("ボットの追加に失敗しました:", error);
      },
    }
  );
  const updateQABot = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_qa_bot`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["bot"] });
      },
      onError: (error: any) => {
        console.error("ボットの更新に失敗しました:", error);
      },
    }
  );
  // Botの削除ミューテーションを追加
  const deleteBot = useMutation(
    (botId: string) => axiosInstance.delete(`/delete_bot/${botId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bot"] });
      },
      onError: (error: any) => {
        console.error("Botの削除に失敗しました:", error);
      },
    }
  );
  const updateBotCategory = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_bot_category`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["bot", "category"] });
      },
      onError: (error: any) => {
        console.error("カテゴリーの更新に失敗しました:", error);
      },
    }
  );

  // インテントの追加
  const addIntent = useMutation(
    (intentData) => axiosInstance.post("/add_intent", intentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bot", "intents"]);
      },
      onError: (error: any) => {
        console.error("インテントの追加に失敗しました:", error);
      },
    }
  );

  // インテントの削除
  const deleteIntent = useMutation(
    (intentId) => axiosInstance.delete(`/delete_intent/${intentId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bot", "intents"]);
      },
      onError: (error: any) => {
        console.error("インテントの削除に失敗しました:", error);
      },
    }
  );
  const updateIntent = useMutation(
    (intentData) => axiosInstance.post("/update_intent", intentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bot", "intents"]);
      },
      onError: (error: any) => {
        console.error("インテントの更新に失敗しました:", error);
      },
    }
  );

  // ★ 追加箇所: NLP手動トレーニングをトリガーする
  const trainNLP = useMutation(
    async () => {
      // `/train_nlp` はサーバーサイド(index.ts等)で定義済みのエンドポイント
      return axiosInstance.post(`/train_nlp`);
    },
    {
      onSuccess: () => {
        // ここでは学習完了後に再度Bot一覧などを更新したい場合invalidateQueriesします。
        queryClient.invalidateQueries(["bot"]);

        // 必要に応じてトースト表示やメッセージ表示などを追加
        console.log("NLPのトレーニングが開始されました。");
      },
      onError: (error: any) => {
        console.error("NLPトレーニングのリクエストに失敗しました:", error);
      },
    }
  );

  return {
    addBotCategory,
    addBot,
    updateQABot,
    deleteBot,
    updateBotCategory,
    addIntent,
    deleteIntent,
    updateIntent,
    trainNLP,
  };
};
