import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload folder dynamically
const uploadPath = path.join(process.cwd(), "uploads");

// Ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // ✅ always valid
  },
  filename: (req, file, cb) => {
    // Remove spaces and keep file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "-"); // prevent invalid characters
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

// File filter (optional but clean)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Export upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});
