import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.router.js";
import postsRouter from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/notification", notificationRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  dbConnection();
});
