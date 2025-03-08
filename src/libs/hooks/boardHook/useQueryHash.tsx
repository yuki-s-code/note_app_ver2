import { useQuery } from "react-query";
import axios from "axios";
import { HASH } from "../../types/board";

const apiUrl = "http://localhost:8088/boards";

export const useQueryAllHash = () => {
  const getAllHash = async () => {
    const { data } = await axios.get<HASH>(`${apiUrl}/get_all_hash`);
    console.log(data);
    return data;
  };
  return useQuery<HASH, Error>({
    queryKey: ["hash"],
    queryFn: getAllHash,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
