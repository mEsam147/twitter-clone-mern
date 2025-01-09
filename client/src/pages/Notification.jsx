import React from "react";
import { FaHeart } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import PostSkeleton from "../components/Skeleton/PostSkeleton";

const Notification = () => {
  const queryClient = useQueryClient();
  const { data: notification, isLoading: LoadingNotifications } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      try {
        let res = await axios.get("/api/notification");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutate: deleteNotifications, isPending } = useMutation({
    mutationFn: async () => {
      try {
        let res = await axios.delete("/api/notification/delete");
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["notification"],
      });
    },
  });
  // if (LoadingNotifications) {
  //   return (
  //     <div className="md:w-[70%]  h-screen  ">
  //       <PostSkeleton />
  //       <PostSkeleton />
  //       <PostSkeleton />
  //       <PostSkeleton />
  //     </div>
  //   );
  // }

  return (
    <div className="border-r border-secondary  md:w-[70%] h-screen overflow-y-scroll no-scrollbar w-full  ">
      <div className="flex items-center justify-between p-4 border-b border-secondary ">
        <h1 className="text-white text-lg font-semibold uppercase">
          Notifications
        </h1>
        <div className="hidden md:block">
          <div className="dropdown">
            <div tabIndex={0} role="button" className=" m-1">
              <FaGear className="text-xl" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <button className="btn" onClick={() => deleteNotifications()}>
                  {isPending ? <Spinner /> : "Delete All Notifications"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <button
          className="btn text-sm md:hidden"
          onClick={() => deleteNotifications()}
        >
          {isPending ? <Spinner /> : "Delete All"}
        </button>
      </div>
      {notification?.length === 0 && (
        <div className="text-center font-semibold text-white w-full  text-xl uppercase  mt-5">
          Not Notifications Yet 😊
        </div>
      )}

      <div className="flex flex-col w-full gap-y-2 ">
        {notification?.map((item) => {
          return (
            <div className="w-full ">
              <div className="border-b border-secondary py-2 px-4 w-full">
                <div className="flex items-center gap-x-2 w-full ">
                  {item.types === "like" ? (
                    <FaHeart className="md:text-3xl text-xl text-rose-500" />
                  ) : (
                    <FaUser className="md:text-3xl text-xl text-blue-500" />
                  )}
                  <div className=" ">
                    <img
                      src={
                        item.from.profileImage === ""
                          ? "/emptyProfile.png"
                          : item.from.profileImage
                      }
                      alt=""
                      className="w-12 h-12  rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2 mt-2 ml-10 w-full">
                  <p className="text-white font-semibold text-md md:text-lg md:uppercase">
                    {item?.from?.name}
                  </p>
                  <p className="text-white/25 text-md md:text-lg flex items-center gap-x-1 ml-2 font-semibold">
                    <p>
                      {item.types === "like" ? "Liked Your Post" : "Following"}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
