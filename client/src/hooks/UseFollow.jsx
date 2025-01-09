import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const UseFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (id) => {
      
      try {
        let response = await axios.post(`/api/user/follow/${id}`);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggested"],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {follow,isPending}
};

export default UseFollow;
