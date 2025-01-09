import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Post from "./Post";

const Following = ({ feedType }) => {
  const { data: following, isPending } = useQuery({
    queryKey: ["following", feedType],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/following`);
      return response.data;
    },
  });

  return (
    <div>
      {following?.length === 0 && (
        <div className="text-center font-semibold text-white text-lg md:text-xl uppercase">
          You&apos; re not following anyone yet
        </div>
      )}
      {following?.map((item) => (
        <Post item={item} key={item._id} />
      ))}
    </div>
  );
};

export default Following;
