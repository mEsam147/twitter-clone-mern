import express from "express";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import {
  deleteNotification,
  getNotifications,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/delete", protectedRoute, deleteNotification);

export default router;
