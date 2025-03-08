import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

const apiUrl = "http://localhost:8088";

// eslint-disable-next-line import/prefer-default-export
export const useMutateUserFollow = () => {
  const queryClient = useQueryClient();
  const noteFollowMutation = useMutation(
    (note) => axios.post(`${apiUrl}/note_follow`, note),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["notefollow"] });
      },
    }
  );
  return {
    noteFollowMutation,
  };
};
