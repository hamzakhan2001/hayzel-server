// backend/routes/adminBlogRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { getAllAdminBlogs } from "../controllers/blogController.js";
import { createBlog, updateBlog, deleteBlog, getBlogById } from "../controllers/blogController.js";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
router.post("/blogs", verifyToken, upload.single("featured_image"), createBlog);
router.put("/blogs/:id", verifyToken, upload.single("featured_image"), updateBlog);
router.get("/blogs", verifyToken, getAllAdminBlogs);
router.get("/blogs/:id", verifyToken, getBlogById);
router.delete("/blogs/:id", verifyToken, deleteBlog);


export default router;