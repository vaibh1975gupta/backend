import express from "express";
import {
  addVideo,
  getVideos,
  deleteVideo,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("student", "teacher", "admin", "parent"),
  getVideos
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  addVideo
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  deleteVideo
);

export default router;