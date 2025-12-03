// // backend/controllers/commentController.js
// import db from "../config/db.js";

// // Create a promise-based connection
// const pool = db.promise();

// // 🟢 Add Comment
// export const addComment = async (req, res) => {
//   try {
//     const { blog_id, name, email, comment } = req.body;

//     if (!blog_id || !comment) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     await pool.query(
//       "INSERT INTO comments (blog_id, name, email, comment) VALUES (?, ?, ?, ?)",
//       [blog_id, name || "Anonymous", email || null, comment]
//     );

//     res.status(201).json({ message: "Comment added successfully" });
//   } catch (err) {
//     console.error("Comment Add Error:", err);
//     res.status(500).json({ message: "DB error while adding comment", error: err });
//   }
// };

// // 🟢 Get Comments by Blog
// export const getCommentsByBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;

//     const [rows] = await pool.query(
//       "SELECT id, name, comment, replied_by_admin, created_at FROM comments WHERE blog_id = ? ORDER BY created_at DESC",
//       [blogId]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("Get Comments Error:", err);
//     res.status(500).json({ message: "DB error while fetching comments", error: err });
//   }
// };

// // 🟢 Admin Reply to Comment
// export const replyComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reply } = req.body;

//     await pool.query("UPDATE comments SET replied_by_admin = ? WHERE id = ?", [reply, id]);

//     res.json({ message: "Admin replied successfully" });
//   } catch (err) {
//     console.error("Reply Comment Error:", err);
//     res.status(500).json({ message: "DB error while replying", error: err });
//   }
// };
