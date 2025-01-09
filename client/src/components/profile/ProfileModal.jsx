import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProfileModal = () => {
  const queryClient = new QueryClient();
  const { data: authUser, refetch } = useQuery({
    queryKey: ["authUser"],
  });
  const [formData, setFormData] = useState({
    fullName: authUser?.user?.fullName,
    name: authUser?.user?.name,
    email: authUser?.user?.email,
    currentPassword: "",
    newPassword: "",
    bio: authUser?.user?.bio,
    link: authUser?.user?.link,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async ({ formData }) => {
      await axios
        .post("/api/user/updateProfile", { ...formData })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    updateProfile({ formData });
  };

  return (
    <div className="">
      <dialog id="my_modal_2" className="modal ">
        <div className="modal-box no-scrollbar">
          <h1 className="font-bold text-xl text-white capitalize my-2">
            update Your Profile
          </h1>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 w-full">
              <input
                placeholder="Full Name"
                type="text"
                name="fullName"
                id="fullName"
                className="input input-bordered w-1/2"
                value={formData.fullName}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="UserName"
                name="name"
                id="name"
                className="input input-bordered w-1/2"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <input
                placeholder="Email"
                type="text"
                name="email"
                id="email"
                className="input input-bordered w-1/2"
                value={formData.email}
                onChange={handleChange}
              />
              <textarea
                className="textarea textarea-bordered w-1/2"
                type="text"
                id="bio"
                placeholder="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <input
                placeholder="Current Password"
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="input input-bordered w-1/2"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                id="newPassword"
                className="input input-bordered w-1/2"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <input
                placeholder="Link"
                type="text"
                name="link"
                id="link"
                className="input input-bordered w-full"
                value={formData.link}
                onChange={handleChange}
              />
            </div>

            <button
              className=" w-full text-white font-semibold text-lg bg-primary py-2 rounded-full hover:bg-cyan-400 hover:text-black"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProfileModal;
