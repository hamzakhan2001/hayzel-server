import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check", (req, res) => {
  res.json({ ok: true });
});
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected test route
router.get("/verify", verifyToken, (req, res) => {
  res.json({ message: "Token verified successfully!", admin: req.admin });
});

export default router;
