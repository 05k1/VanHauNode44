import express from "express";
import userRoutes from "./user.router.js";
import videoRoutes from "./video.router.js";

// tao obj router tong
const rootRoutes = express.Router();
rootRoutes.use("/users", userRoutes);
rootRoutes.use("/videos", videoRoutes);

// export rootRoutes cho index.js dung
export default rootRoutes;
