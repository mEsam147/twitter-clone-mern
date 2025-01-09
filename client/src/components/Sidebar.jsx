import React, { useEffect } from "react";
import XSvg from "./svg/X";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { data: authUser, refetch: authRefetch } = useQuery({
    queryKey: ["authUser"],
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axios
        .post("/api/auth/logout")
        .then((res) => {
          queryClient.invalidateQueries(["authUser"]);
        })
        .catch((error) => {
          throw error;
        });
    },
    onSuccess: () => {
      toast.success("Logout Successfully");
      queryClient.invalidateQueries(["authUser "]);
    },
  });

  return (
    <div className="border-r border-white/20 h-screen flex justify-between flex-col">
      <div className="flex flex-col gap-y-8 px-1">
        <XSvg className="md:w-14 w-10 cursor-pointer" />
        <ul className="flex flex-col gap-y-6 ">
          <li>
            <Link
              to={"/"}
              className="flex items-center gap-x-3 text-lg font-semibold hover:bg-secondary rounded-l py-2.5 px-2  "
            >
              <FaHome className="text-2xl  text-white " />
              <p className="sm:block hidden">Home</p>
            </Link>
          </li>
          <li>
            <Link
              to={"/notification"}
              className="flex items-center gap-x-3 text-lg font-semibold hover:bg-secondary rounded-l py-2.5 px-2  "
            >
              <FaBell className="text-2xl  text-white" />
              <p className="sm:block hidden">Notification</p>
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${authUser?.user?.name}`}
              className="flex items-center gap-x-3 text-lg font-semibold hover:bg-secondary rounded-l py-2.5 px-2  "
            >
              <FaUserAlt className="text-2xl  text-white" />
              <p className="sm:block hidden">Profile</p>
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-10">
        <button className="flex justify-between w-full rounded-l-full hover:bg-secondary py-2 px-1">
          <Link to={`/profile/${authUser?.user?.name}`}>
            <div className="flex items-center gap-x-3 ">
              <img
                src={
                  authUser.user.profileImage === ""
                    ? "/emptyProfile.png"
                    : authUser.user.profileImage
                }
                alt=""
                className="w-12 h-12 object-cover rounded-full hidden sm:block"
              />
              <div className="sm:flex flex-col hidden ">
                <span className="text-sm font-semibold text-white">
                  {authUser.user.name}
                </span>
                <span className="text-sm text-gray-400">
                  {authUser.user.fullName}
                </span>
              </div>
            </div>
          </Link>
          <div className="sm:text-lg text-2xl text-white p-1">
            <FiLogOut onClick={() => logout()} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
