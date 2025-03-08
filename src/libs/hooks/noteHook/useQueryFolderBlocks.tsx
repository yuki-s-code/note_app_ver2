//useQueryFolderBlocks.tsx

import { useInfiniteQuery, useQuery } from "react-query";
import axios from "axios";
import { COMPLEXTREEFOLDER, NOTEBLOCKS, SearchResult } from "../../types/note";

const apiUrl = "http://localhost:8088/notes";

interface SearchResponse {
  status: boolean;
  results: SearchResult[];
  hasMore: boolean;
  msg: string;
}

interface SearchPage {
  results: SearchResult[];
  hasMore: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const useQueryTreeFolder = () => {
  const getTreeFolder = async () => {
    const { data } = await axios.get<COMPLEXTREEFOLDER>(
      `${apiUrl}/get_folder_tree`
    );
    return data;
  };
  return useQuery<COMPLEXTREEFOLDER, Error>({
    queryKey: ["folderBlocks", "tree"],
    queryFn: getTreeFolder,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
// eslint-disable-next-line import/prefer-default-export
export const useQueryTreeFolders = () => {
  const getTreeFolders = async () => {
    const { data } = await axios.get<COMPLEXTREEFOLDER>(
      `${apiUrl}/get_folder_trees`
    );
    return data;
  };
  return useQuery<COMPLEXTREEFOLDER, Error>({
    queryKey: ["folderBlocks", "tree"],
    queryFn: getTreeFolders,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
export const useQueryTreeFolderId = (index: any) => {
  const getTreeFolderId = async () => {
    const { data } = await axios.get<COMPLEXTREEFOLDER>(
      `${apiUrl}/get_folder_tree_id`,
      {
        params: {
          index,
        },
      }
    );
    return data;
  };
  return useQuery<COMPLEXTREEFOLDER, Error>({
    queryKey: ["folderBlocks", "tree"],
    queryFn: getTreeFolderId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllJournals = () => {
  const getAllJournals = async () => {
    // エンドポイント '/get_all_journals' を呼び出してデータを取得
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_journals`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    // キャッシュキーを "folderBlocks", "allJournals" にする例
    queryKey: ["folderBlocks", "journals"],
    queryFn: getAllJournals,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryFolderBlocks = (id: string) => {
  const getFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryJournalBlocks = (id: string) => {
  const getJournalBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["journals"],
    queryFn: getJournalBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryMentionBlocks = (id: string) => {
  const getJournalBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(
      `${apiUrl}/get_folder_drawer`,
      {
        params: {
          id,
        },
      }
    );
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getJournalBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryDataSheet = (id: string) => {
  const getDataSheet = async () => {
    const { data } = await axios.get(`${apiUrl}/get_data_sheet`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getDataSheet,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryExcalidraw = (id: string) => {
  const getExcalidraw = async () => {
    const { data } = await axios.get(`${apiUrl}/get_excalidraw`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getExcalidraw,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllFolderBlocks = () => {
  const getAllFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_folder`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getAllFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllSortFolderBlocks = (page: number) => {
  const getAllSortFolderBlocks = async () => {
    try {
      const { data } = await axios.get<NOTEBLOCKS>(
        `${apiUrl}/get_all_sort_folder`,
        {
          params: {
            page,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error("データの取得に失敗しました");
    }
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks", page],
    keepPreviousData: true,
    queryFn: getAllSortFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQuerySearchList = () => {
  const getSearchList = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_folder`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folder"],
    queryFn: getSearchList,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryMentionList = () => {
  const getMentionList = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_mention`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["mentionList"],
    queryFn: getMentionList,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
export const useQueryTrashList = (page: any) => {
  const getAllTrash = async () => {
    const { data } = await axios.get(`${apiUrl}/get_all_trash`, {
      params: {
        page,
      },
    });
    return data;
  };
  return useQuery({
    queryKey: ["trash", "tree", "folderBlocks"],
    queryFn: getAllTrash,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllSearchFolderBlocks = () => {
  const getAllSearchFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_search`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks", "search"],
    queryFn: getAllSearchFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useSearchFolders = (searchText: string, limit: number = 4) => {
  return useInfiniteQuery<SearchPage, Error>(
    ["searchFolders", searchText],
    async ({ pageParam = 1 }) => {
      const response = await axios.get<SearchResponse>(
        "http://localhost:8088/notes/search",
        {
          params: {
            query: searchText,
            page: pageParam,
            limit,
          },
        }
      );

      if (response.data.status) {
        return {
          results: response.data.results,
          hasMore: response.data.hasMore,
        };
      } else {
        throw new Error(response.data.msg || "検索に失敗しました。");
      }
    },
    {
      enabled: searchText.length >= 2, // Only run if searchText is at least 2 characters
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
      staleTime: 0,
      refetchOnWindowFocus: true,
    }
  );
};
export const useQueryJournalsByMonth = (month: string) => {
  const getJournalsByMonth = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(
      `${apiUrl}/get_journals_by_month`,
      {
        params: { month },
      }
    );
    return data;
  };

  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks", "journals", month], // クエリキーを具体化
    queryFn: getJournalsByMonth,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryUncheckedItems = () => {
  return useQuery<any[], Error>(
    ["uncheckedItems"],
    async () => {
      const response = await axios.get<any>(`${apiUrl}/get_unchecked_items`);
      if (response.data.status) {
        return response.data.folders;
      } else {
        throw new Error(response.data.msg);
      }
    },
    {
      staleTime: 0,
      refetchOnWindowFocus: true,
    }
  );
};
