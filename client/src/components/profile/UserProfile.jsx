import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import ProfileModal from "./ProfileModal";
import ProfileHeaderSkeleton from "../Skeleton/ProfileSkeleton";
import formatDuration, { getDate } from "../../helper/DateFormating";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UseFollow from "../../hooks/UseFollow";
import Spinner from "../Spinner";
import axios from "axios";

const UserProfile = ({ isLoading, profileUser, isRefetching }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const { follow, isPending } = UseFollow();
  const queryClient = useQueryClient();

  const { data: authUser, refetch: authRefetch } = useQuery({
    queryKey: ["authUser"],
  });
  const isProfile = profileUser?._id === authUser?.user?._id;

  const [isFollowing, setIsFollowing] = useState(
    authUser?.user?.following?.includes(profileUser?._id)
  );

  const handleFollow = async () => {
    try {
      await follow(profileUser._id);
      queryClient.invalidateQueries(["authUser "]);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: update, isPending: pendingUpdate } = useMutation({
    mutationFn: async () => {
      try {
        const formData = new FormData();
        formData.append("profileImage", profileImage);
        formData.append("coverImage", coverImage);
        const response = await axios.post(`/api/user/updateProfile`, formData);
        console.log(response);
        setCoverImage(null);
        setProfileImage(null);
        queryClient.invalidateQueries(["authUser "]);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries(["authUser "]);
      authRefetch();
    },
  });

  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImageUrl(reader.result);
      };
      reader.readAsDataURL(coverImage);
    }
  }, [coverImage]);

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  return (
    <div>
      {isLoading || (isRefetching && <ProfileHeaderSkeleton />)}
      {!isLoading && !isRefetching && (
        <>
          <div className="relative group">
            <img
              src={coverImageUrl || profileUser?.coverImage || "/cover.png"}
              className="relative w-full h-[320px] object-cover"
              alt=""
            />
            {isProfile && (
              <>
                <label
                  htmlFor="cover-picture"
                  className="absolute top-3 right-3 text-secondary cursor-pointer text-lg hover:text-primary hidden group-hover:block rounded-full group-hover:text-white  "
                >
                  <FaPen />
                </label>
                <input
                  type="file"
                  id="cover-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCoverImage(file); // Update coverImage state
                      const reader = new FileReader();
                      reader.onload = () => {
                        setCoverImageUrl(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-between px-4">
            <div className="relative group">
              <img
                src={
                  profileImageUrl ||
                  profileUser?.profileImage ||
                  "/emptyProfile.png"
                }
                className=" w-28 h-28 relative object-cover -top-14 md:-top-10 rounded-full"
                alt=""
              />
              {isProfile && (
                <>
                  <label
                    htmlFor="profile-picture"
                    className="absolute -top-5 right-3 text-secondary cursor-pointer text-lg hover:text-primary hidden group-hover:block group-hover:bg-primary p-2 rounded-full group-hover:text-slate-800"
                  >
                    <FaPen className="text-sm" />
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      setProfileImage(e.target?.files[0]);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setProfileImageUrl(reader.result);
                      };
                      reader.readAsDataURL(e.target?.files[0]);
                    }}
                  />
                </>
              )}
            </div>

            <ProfileModal />
            {isProfile ? (
              <div className="flex flex-col md:flex-row gap-y-4 gap-x-3 my-4 md:my-0">
                <button
                  className="border border-secondary md:px-10 md:py-1 text-sm md:text-md py-2.5 px-8 rounded-md md:rounded-full text-white font-semibold hover:bg-primary hover:text-black"
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                >
                  Edit Profile
                </button>

                {!isUpdated && (coverImage || profileImage) && (
                  <button
                    type="submit"
                    className="btn bg-primary px-8 md:rounded-full rounded-md text-lg md:text-lg font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      update();
                    }}
                  >
                    {pendingUpdate ? <Spinner /> : "update"}
                  </button>
                )}
              </div>
            ) : (
              <button
                className="border border-secondary px-10 py-1 rounded-full text-white font-semibold hover:bg-primary hover:text-black"
                onClick={handleFollow}
                disabled={isPending}
              >
                {isFollowing ? "UnFollow" : "Follow"}
              </button>
            )}
          </div>

          <div className="px-7 flex flex-col justify-between gap-y-3">
            <p className="text-white font-semibold capitalize text-lg">
              {profileUser.name}
            </p>
            <p className="text-secondary "># {profileUser?.fullName}</p>
            <p className="text-white/60 font-semibold">{profileUser?.bio}</p>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-2">
                <p className="text-secondary text-lg">
                  <FaPen />
                </p>
                <a href="#" className="text-primary">
                  {profileUser?.link}
                </a>
              </div>

              <div className="flex items-center gap-x-3">
                <p className="text-secondary text-lg">
                  <BsCalendar2Date />
                </p>
                <p className="md:text-lg text-md font-semibold">
                  Joined{getDate(profileUser?.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-4 mt-4">
              <div className="flex items-center gap-x-2">
                <p className="font-semibold md:text-lg ">
                  {profileUser?.followers?.length}
                </p>
                <p className="md:text-lg  text-white/20  font-bold">
                  Followers
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <p className="font-semibold md:text-lg">
                  {profileUser?.following?.length}
                </p>
                <p className="md:text-lg text-white/20  font-bold">Following</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
