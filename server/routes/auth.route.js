import express from "express";
import {
  getMyProfile,
  login,
  logout,
  register,
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.get("/profile", protectedRoute, getMyProfile);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
