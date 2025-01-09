import React, { useState } from "react";
import RightPanelSkeleton from "./Skeleton/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "./posts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UseFollow from "../hooks/UseFollow";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const RightPanel = () => {
  const { follow, isPending } = UseFollow();

  const { data: suggested, isLoading } = useQuery({
    queryKey: ["suggested"],
    queryFn: async () => {
      try {
        let response = await axios.get("/api/user/suggested");
        // console.log(response);
        return response.data.filterSuggestUsers;
      } catch (error) {
        console.log(error);
      }
    },
  });
  if (suggested?.length === 0) return <div className="md:w-1/5 "></div>;

  return (
    <div className="bg-secondary h-full rounded-md md:w-1/3 lg:w-1/4 ml-2 mt-4 py-4 px-2 hidden md:block">
      <h1 className="text-white text=lg font-semibold mb-3">Who To Follow</h1>
      {isLoading ? (
        <>
          <RightPanelSkeleton />
          <RightPanelSkeleton />
          <RightPanelSkeleton />
          <RightPanelSkeleton />
          <RightPanelSkeleton />
        </>
      ) : (
        <div className="flex flex-col gap-y-5">
          {suggested?.map((item, index) => {
            return (
              <div className="flex items-center justify-between" key={index}>
                <Link to={`/profile/${item?.name}`}>
                  <div className="flex items-center gap-x-2">
                    <img
                      src={
                        item.profileImage === ""
                          ? "/emptyProfile.png"
                          : item.profileImage
                      }
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    <div className="flex flex-col gap-y-0">
                      <p className="text-sm lg:whitespace-nowrap">
                        {item.fullName}
                      </p>
                      <p className="text-slate-500 text-sm">{item.name}</p>
                    </div>
                  </div>
                </Link>
                <div>
                  <button
                    className="py-2 px-4 text-black bg-white  rounded-full hover:bg-primary hover:text-black font-semibold"
                    onClick={() => follow(item._id)}
                  >
                    {isPending ? <Spinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
