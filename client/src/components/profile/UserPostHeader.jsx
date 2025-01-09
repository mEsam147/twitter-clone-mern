import React, { useState } from "react";
import Likes from "./Likes";

const UserPostHeader = ({ feedType, setFeedType }) => {

  return (
    <div className="mt-10 ">
      <div className="border-b border-secondary flex items-center justify-around py-2 w-full">
        <p
          className="text-white font-semibold text-center text-lg relative  cursor-pointer w-1/2"
          onClick={() => setFeedType("posts")}
        >
          Posts
          {feedType === "posts" && (
            <span className="absolute -bottom-2.5 left-[50%] translate-x-[-50%] w-1/6  mx-auto   h-1 bg-primary"></span>
          )}
        </p>
        <p
          className="text-white font-semibold text-lg relative  cursor-pointer text-center w-1/2 "
          onClick={() => setFeedType("likes")}
        >
          Likes
          {feedType === "likes" && (
            <span className="absolute -bottom-2.5 left-[50%] translate-x-[-50%] w-1/6 mx-auto   h-1 bg-primary"></span>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserPostHeader;
