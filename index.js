import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import db from "./config/db.js";
import { ipWhitelist } from "./middleware/ipWhitelist.js";
import emailRoutes from "./routes/email.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import publicBlogRoutes from "./routes/publicBlogRoutes.js";

dotenv.config();

const app = express();

// ✅ 1️⃣ Enable CORS (must be first)
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  })
);

// ✅ 2️⃣ Parse requests
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ 3️⃣ Global rate limit
const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// ✅ 4️⃣ Restrict admin routes to trusted IPs

app.use(ipWhitelist);

// ✅ 5️⃣ Connect DB
db.connect((err) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("✅ MySQL Connected...");
});

// ✅ 6️⃣ Routes
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/email", emailRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminBlogRoutes);
app.use("/api", publicBlogRoutes);


// ✅ 7️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running", PORT));