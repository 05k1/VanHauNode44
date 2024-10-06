import express from "express";
import {
  register,
  login,
  loginFacebook,
  extendToken,
  loginAsyncKey,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login); // login bang khoa doi xung
authRoutes.post("/login-face", loginFacebook);
authRoutes.post("/extend-token", extendToken);
authRoutes.post("/login-async-key", loginAsyncKey); // login khoa bat doi xung

export default authRoutes;
