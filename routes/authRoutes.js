import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  adminOnly,
  teacherOnly,
  studentOnly,
  parentOnly,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);

router.get("/admin", authMiddleware, roleMiddleware("admin"), adminOnly);
router.get("/teacher", authMiddleware, roleMiddleware("teacher"), teacherOnly);
router.get("/student", authMiddleware, roleMiddleware("student"), studentOnly);
router.get("/parent", authMiddleware, roleMiddleware("parent"), parentOnly);

export default router;