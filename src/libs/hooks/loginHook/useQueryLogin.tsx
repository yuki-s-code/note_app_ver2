import { useQuery } from "react-query";
import axios from "axios";
import { USER } from "../../types/login";

const apiUrl = "http://localhost:8088/auth";

// eslint-disable-next-line import/prefer-default-export
export const useQueryUser = (id: any, pass: any) => {
  const getUser = async () => {
    const { data } = await axios.get<USER>(`${apiUrl}/login`, {
      params: {
        userid: id,
        passwd: pass,
      },
    });
    return data;
  };
  return useQuery<USER, Error>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryGetUser = (id: any) => {
  const getUser = async () => {
    const { data } = await axios.get<USER>(`${apiUrl}/get_user`, {
      params: {
        userid: id,
      },
    });
    return data;
  };
  return useQuery<USER, Error>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
