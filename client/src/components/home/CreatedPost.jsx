import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation(
    {
      mutationFn: async () => {
        try {
          const formData = new FormData();
          formData.append("text", text);
          formData.append("image", image);
          let res = await axios.post("/api/posts/create", formData);
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      },
      onSuccess: () => {
        setText("");
        setImage(null);
        toast.success("Post created successfully");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    },
    // [text, image]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={authUser?.user?.profileImage || "/avatar-placeholder.png"}
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800 placeholder:text-sm md:placeholder:text-md"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {image && (
          <div className="relative w-72 mx-auto ">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={URL.createObjectURL(image)}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
