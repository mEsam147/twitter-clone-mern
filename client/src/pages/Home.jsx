import React, { useState } from "react";
import CreatedPost from "../components/home/CreatedPost";
import Posts from "../components/home/Posts";
import Following from "../components/home/Following";

const Home = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="md:w-[70%] w-full  border-r border-white/20 h-screen overflow-y-scroll no-scrollbar">
      <div className=" flex items-center justify-evenly border-b border-white/20 py-2 relative ">
        <span
          className={`text-white font-semibold text-lg relative  cursor-pointer`}
          onClick={() => setFeedType("forYou")}
        >
          For You
          {feedType === "forYou" && (
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-primary"></div>
          )}
        </span>

        <span
          className="text-white font-semibold text-lg relative cursor-pointer "
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && (
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-primary"></div>
          )}
        </span>
      </div>

      <div className="my-4">
        <CreatedPost />
      </div>
      <div>{feedType === "forYou" && <Posts feedType={feedType} />}</div>
      <div>{feedType === "following" && <Following feedType={feedType} />}</div>
    </div>
  );
};

export default Home;
