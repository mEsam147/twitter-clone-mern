import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import Post from "../home/Post";
import PostSkeleton from "../Skeleton/PostSkeleton";

const Likes = ({ name }) => {
  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
  });

  const {
    data: likes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["likes"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/posts/likes/${profileUser?._id}`
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [name, refetch]);
  return (
    <div>
      {isLoading && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {likes?.map((item) => {
        return <Post item={item} />;
      })}
    </div>
  );
};

export default Likes;
