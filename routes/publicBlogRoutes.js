// backend/routes/publicBlogRoutes.js
import express from "express";
import { getAllBlogs, getBlogBySlug } from "../controllers/blogController.js";
// import { addComment, getCommentsByBlog } from "../controllers/commentController.js";
import { incrementLike } from "../controllers/blogController.js";
const router = express.Router();

router.get("/blogs", getAllBlogs);
router.get("/blogs/:slug", getBlogBySlug);

// comments
// router.post("/comments", addComment);
// router.get("/comments/:blogId", getCommentsByBlog);
router.post("/blogs/:id/like", incrementLike);

export default router;
