import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getChildAttendance,
  getClassAttendance,
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  markAttendance
);

router.get(
  "/student",
  authMiddleware,
  roleMiddleware("student"),
  getStudentAttendance
);

router.get(
  "/parent/:childId",
  authMiddleware,
  roleMiddleware("parent"),
  getChildAttendance
);

router.get(
  "/class",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  getClassAttendance
);

export default router;