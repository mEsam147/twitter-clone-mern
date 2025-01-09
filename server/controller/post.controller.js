import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  const { text, postedBy } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }
  try {
    const userId = req.user._id;
    console.log(userId);
    

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User  not found" });

    let imageUrl = null;

    if (req.file) {
      imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    const newPost = new Post({ text, image: imageUrl, userId: userId });
    await newPost.save();
    res.status(200).json({ post: newPost, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== userId.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const comments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userComment = {
      text,
      user: userId,
    };

    post.comments.push(userComment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    const usersLikes = post.likes.includes(userId);
    if (usersLikes) {
      await Post.updateOne(
        { _id: id },
        {
          $pull: {
            likes: userId,
          },
        }
      );
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            likedPosts: id,
          },
        }
      );
      const filterLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res
        .status(200)
        .json({ message: "Post unliked successfully", filterLikes });
    } else {
      await Post.updateOne(
        { _id: id },
        {
          $push: {
            likes: userId,
          },
        }
      );
      await User.updateOne(
        { _id: userId },
        {
          $push: {
            likedPosts: id,
          },
        }
      );

      const newNotification = new Notification({
        types: "like",
        from: userId,
        to: post.userId,
      });
      await newNotification.save();

      const updatedLikes = post.likes;

      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!posts) return res.status(404).json({ message: "No posts found" });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const following = user.following;
    
    const posts = await Post.find({ userId: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (!posts) return res.status(404).json({ message: "No posts found" });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const userPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id })
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({
        createdAt: -1,
      });

    if (posts.length === 0) {
      return res.status(404).json({
        message: "No posts found for this user",
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching posts",
    });
  }
};

export const postLikes = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const likedPostIds = user.likedPosts;

    const posts = await Post.find({ _id: { $in: likedPostIds } }).populate({
      path: "userId",
      select: "-password",
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
