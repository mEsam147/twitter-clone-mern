import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

import XSvg from "../components/svg/X";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    email: "",
    password: "",
  });
  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: async ({ name, fullName, email, password }) => {
      try {
        const response = await axios.post("/api/auth/register", {
          name,
          fullName,
          email,
          password,
        });
        toast.success("User Created Successfully");
      } catch (error) {
        throw error;
      }
    },

    onSuccess: () => {
      setFormData({ name: "", fullName: "", email: "", password: "" });
    },
  });
  if (isError) {
    console.log(error);
    // toast.error(error.response.data.message);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="flex items-center h-screen justify-center flex-col md:flex-row md:gap-x-4 md:px-10   w-full text-left ">
      <div className="hidden md:block md:w-[300px] lg:w-[50%]  ">
        <XSvg />
      </div>
      <div className="w-[80%] sm:w-[70%] md:w-[70%]  ">
        <div className=" w-14 md:hidden">
          <XSvg />
        </div>
        <h1 className="font-bold text-4xl text-white capitalize my-2 ">
          Join Today.
        </h1>
        <form
          action=""
          className="flex flex-col gap-y-3 md:w-full"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="jhoneDoe@example.com"
              className="input input-bordered input-accent w-full  relative pl-8 placeholder:text-sm"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <IoIosMail className="absolute top-[50%] translate-y-[-50%] left-2 text-slate-400 text-lg" />
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="JHON  "
                className="input input-bordered input-accent w-full  relative pl-8 placeholder:text-sm"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <FaRegUser className="absolute top-[50%] translate-y-[-50%] left-2 text-slate-400 text-lg" />
            </div>
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="jhon"
                className="input input-bordered input-accent w-full  relative pl-8 placeholder:text-sm"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <MdDriveFileRenameOutline className="absolute top-[50%] translate-y-[-50%] left-2 text-slate-400 text-lg" />
            </div>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="******"
              className="input input-bordered input-accent w-full  relative pl-8 placeholder:text-sm"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <MdOutlinePassword className="absolute top-[50%] translate-y-[-50%] left-2 text-slate-400 text-lg" />
          </div>

          <button
            className="btn btn-primary w-full text-white text-lg rounded-full x "
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        {isError && (
          <p className="my-2 text-red-500 capitalize font-semibold">
            {error.response.data.message}
          </p>
        )}

        <div className="w-1/2 mx-auto text-center justify-center  mt-5 flex flex-col gap-y-4">
          <p className="text-white sm:text-lg font-semibold ">
            Already hav an Account?
          </p>
          <Link to={"/login"}>
            <button className="btn-secondary text-cyan-800 border border-cyan-500 rounded-full w-full py-2 font-semibold hover:bg-primary hover:text-white">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
