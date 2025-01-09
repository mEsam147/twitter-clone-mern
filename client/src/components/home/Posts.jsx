import React, { Fragment, useEffect, useState } from "react";
import PostSkeleton from "../Skeleton/PostSkeleton";
// import { POSTS } from "../posts";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Posts = ({ feedType }) => {
  const endPoint = () => {
    if (feedType == "forYou") {
      return "/api/posts";
    }
  };

  const End_POIENT = endPoint();
  const {
    data: POST,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axios.get(End_POIENT);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-y-5 justify-center w-full no-scrollbar">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {POST?.posts?.length === 0 && (
        <div className="text-center w-full text-cyan-500 font-semibold uppercase text-xl">
          There's No Posts
        </div>
      )}
      {!isLoading && !isRefetching && (
        <>
          <div>
            {POST?.posts?.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Post item={item} />
                </Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Posts;
