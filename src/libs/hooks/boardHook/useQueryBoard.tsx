//useQueryBoard.tsx

import { useQuery } from "react-query";
import axios from "axios";
import { BOARD, HASH } from "../../types/board";

const apiUrl = "http://localhost:8088/boards";

// eslint-disable-next-line import/prefer-default-export
export const useQueryBoard = (id: string) => {
  const getBoard = async () => {
    const { data } = await axios.get<BOARD>(`${apiUrl}/get_board`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<BOARD, Error>({
    queryKey: ["board"],
    queryFn: getBoard,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllBoard = (page: number) => {
  const getAllBoard = async () => {
    const { data } = await axios.get<BOARD>(`${apiUrl}/get_all_board`, {
      params: {
        page,
      },
    });
    return data;
  };
  return useQuery<BOARD, Error>({
    queryKey: ["board"],
    queryFn: getAllBoard,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllBoardHashtag = () => {
  const getAllBoardHashtag = async () => {
    const { data } = await axios.get<BOARD>(`${apiUrl}/get_hashtag`);
    return data;
  };
  return useQuery<BOARD, Error>({
    queryKey: ["hashtag"],
    queryFn: getAllBoardHashtag,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryBoardFavorite = (page: number, user: any) => {
  const getBoardFavorite = async () => {
    const { data } = await axios.get<BOARD>(`${apiUrl}/get_board_favorite`, {
      params: {
        page,
        user,
      },
    });
    return data;
  };
  return useQuery<BOARD, Error>({
    queryKey: ["board"],
    queryFn: getBoardFavorite,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
