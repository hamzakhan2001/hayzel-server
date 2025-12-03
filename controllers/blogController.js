
// backend/controllers/blogController.js
import db from "../config/db.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

// ✅ USE PROMISES EVERYWHERE
const pool = db.promise();

export const getAllBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, slug, excerpt, featured_image, author_name, created_at, likes, views FROM blogs WHERE is_published = 1 ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};

export const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE slug = ?", [slug]);
    const blog = rows[0];
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await pool.query("UPDATE blogs SET views = views + 1 WHERE id = ?", [blog.id]);

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, author_name, is_published = 1 } = req.body;
    const featured_image = req.file ? `/uploads/${req.file.filename}` : null;

    let slug = slugify(title, { lower: true, strict: true });
    let [existing] = await pool.query("SELECT id FROM blogs WHERE slug = ?", [slug]);
    let suffix = 1;
    while (existing.length > 0) {
      slug = `${slug}-${suffix++}`;
      [existing] = await pool.query("SELECT id FROM blogs WHERE slug = ?", [slug]);
    }

    const [result] = await pool.query(
      "INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_name,  is_published) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, slug, excerpt, content, featured_image, author_name, is_published]
    );

    res.status(201).json({ message: "Blog created", id: result.insertId });
  } catch (err) {
    console.error("Blog creation failed:", err);
    res.status(500).json({ message: "Create error", error: err.message });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, author_name, is_published = 1 } = req.body;

    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
    const old = rows[0];
    if (!old) return res.status(404).json({ message: "Blog not found" });

    let featured_image = old.featured_image;
    if (req.file) {
      if (featured_image) {
        const oldPath = path.join(process.cwd(), "backend", featured_image);
        try {
          fs.unlinkSync(oldPath);
        } catch {}
      }
      featured_image = `/uploads/${req.file.filename}`;
    }

    let slug = old.slug;
    if (title && title !== old.title) {
      slug = slugify(title, { lower: true, strict: true });
      let [existing] = await pool.query(
        "SELECT id FROM blogs WHERE slug = ? AND id != ?",
        [slug, id]
      );
      let suffix = 1;
      while (existing.length > 0) {
        slug = `${slug}-${suffix++}`;
        [existing] = await pool.query(
          "SELECT id FROM blogs WHERE slug = ? AND id != ?",
          [slug, id]
        );
      }
    }

    await pool.query(
      `UPDATE blogs SET title=?, slug=?, excerpt=?, content=?, featured_image=?, author_name=?, is_published=? WHERE id=?`,
      [
        title || old.title,
        slug,
        excerpt || old.excerpt,
        content || old.content,
        featured_image,
        author_name || old.author_name,
        is_published,
        id,
      ]
    );

    res.json({ message: "Blog updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update error", error: err });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT featured_image FROM blogs WHERE id = ?", [id]);
    const blog = rows[0];
    if (!blog) return res.status(404).json({ message: "Not found" });

    if (blog.featured_image) {
      const filePath = path.join(process.cwd(), "backend", blog.featured_image);
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }

    await pool.query("DELETE FROM blogs WHERE id = ?", [id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err });
  }
};

export const incrementLike = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE blogs SET likes = likes + 1 WHERE id = ?", [id]);
    const [rows] = await pool.query("SELECT likes FROM blogs WHERE id = ?", [id]);
    res.json({ likes: rows[0].likes });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
};

export const getAllAdminBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, slug, excerpt, featured_image, author_name, created_at, likes, views, is_published FROM blogs ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Blog not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getBlogById error:", err);
    res.status(500).json({ message: "DB error", error: err.message });
  }
};
