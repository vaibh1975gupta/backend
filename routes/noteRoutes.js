import express from "express";
import { addNote, getNotes, deleteNote } from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getNotes);
router.post("/", authMiddleware, adminMiddleware, upload.single("pdf"), addNote);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNote);

export default router;