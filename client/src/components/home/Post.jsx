import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GiChatBubble } from "react-icons/gi";
import { FaHeart } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import moment from "moment";
import formatDuration from "../../helper/DateFormating";
import { Link } from "react-router-dom";

const Post = ({ item, like }) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const isMyPost = authUser?.user?._id === item?.userId?._id;

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        let res = await axios.delete(`/api/posts/delete/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const isComment = false;
  const isLiked = item.likes.includes(authUser.user._id);

  const { mutate: createComment, isPending: commentPending } = useMutation({
    mutationFn: async (id) => {
      await axios
        .post(`/api/posts/comment/${id}`, { text })
        .then((res) => {
          setText("");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSuccess: () => {
      toast.success("Comment Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: likePending } = useMutation({
    mutationFn: async (id) => {
      try {
        let res = await axios.post(`/api/posts/like/${id}`);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  return (
    <div className=" " key={item._id}>
      <div className="border-b border-secondary  my-5">
        <div className="flex items-center justify-between px-3 ">
          <Link to={`/profile/${item?.userId?.name}`}>
            <div className="flex items-center gap-x-3  relative">
              <img
                src={
                  item.userId.profileImage === ""
                    ? "/emptyProfile.png"
                    : item.userId.profileImage
                }
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <p className="text-white capitalize">{item?.userId?.name}</p>
              <p className="text-white/15 text-sm md:text-md">
                {item?.userId?.fullName}
              </p>
              <p className="text-white/30 text-sm md:text-md">
                {formatDuration(item.createdAt)}
              </p>
            </div>
          </Link>
          {isMyPost && (
            <>
              {!isPending && (
                <div
                  className="text-xl text-white hover:text-red-500 cursor-pointer"
                  onClick={() => deletePost(item._id)}
                >
                  <FaTrash />
                </div>
              )}
              {isPending && (
                <div>
                  <Spinner size="small" />
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-10">
          <h3 className="text-white mt-2 ">{item?.text}</h3>
          {item?.image && (
            <div className="border border-secondary rounded-lg">
              <img src={item?.image} className="mx-auto" alt="" />
            </div>
          )}
          <div className="flex justify-between items-center my-3">
            <p
              className="text-white flex items-center gap-x-1 cursor-pointer"
              onClick={() =>
                document.getElementById("my_modal_2" + item._id).showModal()
              }
            >
              <GiChatBubble className="md:text-3xl text-xl text-secondary hover:text-white/15  " />
              <span className="text-sm text-white/15 ">
                {item.comments.length}
              </span>
            </p>

            <dialog id={`my_modal_2${item._id}`} className="modal">
              <div className="modal-box">
                <h1 className="text-white md:text-2xl text-lg font-bold my-5 uppercase">
                  Comments
                </h1>
                <div className="w-full flex items-center gap-x-0 md:gap-x-3 ">
                  <input
                    type="text"
                    className="input w-[80%] input-bordered"
                    placeholder="Add Comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-primary h-12 md:rounded-full rounded-r-md btn w-[20%] md:text-lg  text-md"
                    disabled={isComment}
                    onClick={() => createComment(item?._id)}
                  >
                    {isComment ? <Spinner size="sm" /> : "post"}
                  </button>
                </div>
                {item.comments.length === 0 && (
                  <div className="text-sm my-3 font-semibold capitalize text-white">
                    No Comments Yet || Be The First One 🤗
                  </div>
                )}
                <div className="flex flex-col">
                  {item?.comments?.map((c) => {
                    return (
                      <div
                        className="mt-10 border-b border-secondary py-1"
                        key={c._id}
                      >
                        <div className="flex items-center gap-x-4">
                          <img
                            className="md:w-14 md:h-14 w-10 h-10 rounded-full object-cover"
                            src={
                              c.user.profileImage === ""
                                ? "/emptyProfile.png"
                                : c.user.profileImage
                            }
                            alt=""
                          />
                          <p className="text-white md:text-xl text-md capitalize">
                            {c.user.name}
                          </p>
                          <p className="text-white/20 text-sm md:text-md">
                            {c.user.fullName}
                          </p>
                        </div>

                        <div className="mt-3 px-4">
                          <p className="md:text-lg text-md font-semibold text-white capitalize md:uppercase">
                            comment :
                          </p>
                          <p className="text-slate-500 px-5 break-words mt-4">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <p className="text-white flex items-center gap-x-1 cursor-pointer">
              <BiRepost className="md:text-3xl text-xl text-secondary hover:text-white/15 " />
              <span className="text-sm text-white/15 " onClick={() => item._id}>
                0
              </span>
            </p>

            <p
              className={`text-white flex items-center gap-x-1 cursor-pointer group ${
                isLiked && "text-rose-700"
              }`}
              onClick={() => likePost(item._id)}
            >
              {isLiked && (
                <FaHeart className="md:text-3xl text-xl  text-red-500 hover:text-white/15 group-hover:text-pink-500 " />
              )}
              {!isLiked && !isPending && (
                <FaHeart className="md:text-3xl text-xl  text-slate-500  group-hover:text-pink-500 " />
              )}
              <span className="text-sm text-white/15 mt-2 ">
                {item.likes.length}
              </span>
            </p>
            <p className="text-white flex items-center gap-x-1 cursor-pointer">
              <FaBookmark className="md:text-3xl  text-xl text-secondary hover:text-white/15 " />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
