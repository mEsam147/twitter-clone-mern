import React, { Fragment, useEffect } from "react";
import Post from "../home/Post";
import { POSTS } from "../posts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostSkeleton from "../Skeleton/PostSkeleton";
const UserPost = ({ profileUser, name }) => {
  const {
    data: userPosts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPosts", profileUser?._id],
    queryFn: async () => {
      try {
        let res = await axios.get(`/api/posts/user/${profileUser?._id}`);
        return res.data;
      } catch (error) {
        throw new error();
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [profileUser?._id, name]);

  return (
    <div className="my-3">
      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {!userPosts || userPosts.length === 0 ? (
        <div className="text-center font-semibold text-xl text-white uppercase mt-5">
          There's No Posts 🥶{" "}
        </div>
      ) : (
        userPosts.map((item) => (
          <Fragment key={item._id}>
            <Post item={item} />
          </Fragment>
        ))
      )}
    </div>
  );
};

export default UserPost;
