import express from "express";
import {
  followAndUnFollow,
  getSuggested,
  getUserProfile,
  updateProfile,
} from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import upload from "../helpers/multer.js";

const router = express.Router();

router.get("/profile/:name", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggested);
router.post("/follow/:id", protectedRoute, followAndUnFollow);
router.post(
  "/updateProfile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  protectedRoute,
  updateProfile
);
export default router;
