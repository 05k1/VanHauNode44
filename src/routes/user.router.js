import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../config/upload.js";
import uploadCloud from "../config/uploadCloud.js";

const userRoutes = express.Router();

userRoutes.post("/create-users", createUser);
userRoutes.get("/get-users", getUsers);
userRoutes.delete("/delete-user/:user_id", deleteUser);
userRoutes.put("/update-user/:user_id", updateUser);
userRoutes.post("/upload-avatar", upload.single("hinhanh"), uploadAvatar);
userRoutes.post(
  "/upload-avatar-cloud",
  uploadCloud.single("hinhanh"),
  (req, res) => {
    let file = req.file;
    return res.status(200).json(file);
  }
);

export default userRoutes;
