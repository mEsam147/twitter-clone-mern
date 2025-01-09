import React, { useEffect, useState } from "react";
import { IoIosMail } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";
import XSvg from "../components/svg/X";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorVisible, setErrorVisible] = useState(false);

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      await axios
        .post("/api/auth/login", {
          email,
          password,
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
        })
        .catch((error) => {
          throw error;
        });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });

  useEffect(() => {
    if (isError) {
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  }, [isError]);
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
          let's go.
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
              <div>
                <Spinner />
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        {errorVisible && isError && (
          <p className="text-red-500 font-semibold">
            {error.response.data.message}
          </p>
        )}

        <div className="w-1/2 mx-auto text-center justify-center  mt-5 flex flex-col gap-y-4">
          <p className="text-white sm:text-lg font-semibold ">
            Don't Have an Account?
          </p>
          <Link to={"/register"}>
            <button className="btn-secondary text-cyan-800 border border-cyan-500 rounded-full w-full py-2 font-semibold hover:bg-primary">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
