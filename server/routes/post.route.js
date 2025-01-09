import express from "express";
import {
  comments,
  createPost,
  deletePost,
  getFollowing,
  getPosts,
  likePost,
  postLikes,
  userPosts,
} from "../controller/post.controller.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import upload from "../helpers/multer.js";

const router = express.Router();

router.get("/", protectedRoute, getPosts);
router.get("/following", protectedRoute, getFollowing);
router.get("/user/:id", protectedRoute, userPosts);
router.get("/likes/:id", protectedRoute, postLikes);
router.post("/create", upload.single("image"), protectedRoute, createPost);
router.post("/comment/:id", protectedRoute, comments);
router.post("/like/:id", protectedRoute, likePost);
router.delete("/delete/:id", protectedRoute, deletePost);

export default router;
