import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { useAppDispatch } from "../../app/hooks";
import { resetCreateUser } from "../../../slices/userSlice";
import { CREATEUSER } from "../../types/login";

const apiUrl = "http://localhost:8088/auth";

// eslint-disable-next-line import/prefer-default-export
export const useMutateUser = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const createUserMutation = useMutation(
    (user) => axios.post(`${apiUrl}/adduser/`, user),
    {
      onSuccess: (res: any) => {
        const previousUser = queryClient.getQueryData<CREATEUSER>(["user"]);
        if (previousUser) {
          queryClient.setQueryData<CREATEUSER>(
            ["user"],
            previousUser,
            res.data
          );
        }
        // eslint-disable-next-line no-alert
        alert(JSON.stringify(res.data, undefined, 4));
        if (res.data.status) {
          window.localStorage.sns_auth_token = res.data.token;
        } else {
          window.localStorage.sns_id = "";
        }
        dispatch(resetCreateUser());
      },
    }
  );
  const userUpdatedMutation = useMutation(
    (user) => axios.post(`${apiUrl}/api/user_updated`, user),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
    }
  );
  return {
    createUserMutation,
    userUpdatedMutation,
  };
};
