// useQueryBot.tsx

import { useQuery, useInfiniteQuery, useMutation } from "react-query";
import axios from "axios";
import { Category, Intent } from "@/components/bot/types/types";

const apiUrl = "http://localhost:8088/bots";

// Axios インスタンスの作成
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ボットカテゴリーを取得
export const useQueryBotCategory = () => {
  const getBotCategory = async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get("/get_all_bot_category");
    if (data.status) {
      return data.docs;
    } else {
      throw new Error(data.msg);
    }
  };

  return useQuery<Category[], Error>({
    queryKey: ["bot", "category"],
    queryFn: getBotCategory,
    staleTime: 1000 * 60 * 5, // 5分
    cacheTime: 1000 * 60 * 10, // 10分
    refetchOnWindowFocus: false,
  });
};

// ボットを取得（ページネーション対応）
export const useQueryBot = () => {
  const fetchBots = async ({ pageParam = 1 }): Promise<any> => {
    const { data } = await axiosInstance.get("/get_all_bot", {
      params: {
        page: pageParam,
        limit: 20,
      },
    });
    if (data.status) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  };

  return useInfiniteQuery<any, Error>("bot", fetchBots, {
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      } else {
        return undefined;
      }
    },
    staleTime: 1000 * 60 * 5, // 5分
    cacheTime: 1000 * 60 * 10, // 10分
    refetchOnWindowFocus: false,
  });
};

// すべてのインテントを取得
export const useQueryIntents = () => {
  const getIntents = async (): Promise<Intent[]> => {
    const { data } = await axiosInstance.get("/get_all_intents");
    if (data.status) {
      return data.intents;
    } else {
      throw new Error(data.msg);
    }
  };

  return useQuery<Intent[], Error>({
    queryKey: ["bot", "intents"],
    queryFn: getIntents,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

// カテゴリーIDに基づいてインテントを取得
export const useQueryIntentsByCategory = (categoryId: string) => {
  const getIntentsByCategory = async (): Promise<Intent[]> => {
    const { data } = await axiosInstance.get(
      `/get_intents_by_category/${categoryId}`
    );
    if (data.status) {
      return data.intents;
    } else {
      throw new Error(data.msg);
    }
  };

  return useQuery<Intent[], Error>({
    queryKey: ["bot", "intents", categoryId],
    queryFn: getIntentsByCategory,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!categoryId,
  });
};

export const useMutateBotMessage = () => {
  return useMutation(async (userMessage: string) => {
    const { data } = await axiosInstance.get("/api/get_bot_message", {
      params: { userMessage },
    });
    if (data.status) {
      return data;
    } else {
      throw new Error(data.msg);
    }
  });
};
