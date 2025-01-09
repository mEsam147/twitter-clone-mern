import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import UserProfile from "../components/profile/UserProfile";

import UserPostHeader from "../components/profile/UserPostHeader";
import UserPost from "../components/profile/UserPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Likes from "../components/profile/Likes";

const Profile = () => {
  const [feedType, setFeedType] = useState("posts");

  const queryClient = useQueryClient();
  const { name } = useParams();

  const {
    data: profileUser,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["profileUser"],
    queryFn: async () => {
      try {
        let res = await axios.get(`/api/user/profile/${name}`);
        return res.data;
      } catch (error) {
        throw new Error();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileUser"],
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [name, refetch]);
  return (
    <div className="border-r border-secondary md:w-[70%] w-full h-screen overflow-y-scroll no-scrollbar">
      <div className="flex items-center gap-x-4 px-6 py-2 border-b border-secondary">
        <Link to={"/"}>
          <span className="w-12 text-xl text-white cursor-pointer hover:-translate-x-1 transition-all duration-200">
            <FaArrowLeft />
          </span>
        </Link>
        <div className="flex  items-center  flex-col">
          <p className="text-white text-lg capitalize font-semibold">
            {profileUser?.name}
          </p>
          <p className="text-secondary text-md">#{profileUser?.fullName}</p>
        </div>
      </div>

      <div>
        <UserProfile
          isLoading={isLoading}
          profileUser={profileUser}
          isRefetching={isRefetching}
        />
      </div>

      <div>
        <UserPostHeader feedType={feedType} setFeedType={setFeedType} />
      </div>

      {feedType === "posts" && (
        <div>
          <UserPost profileUser={profileUser} name={name} />
        </div>
      )}
      {feedType === "likes" && (
        <div>
          <Likes name={name} />
        </div>
      )}
    </div>
  );
};

export default Profile;
