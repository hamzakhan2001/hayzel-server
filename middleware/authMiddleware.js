import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        return res.status(403).json({ message: "Invalid token." });
      }

      req.admin = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while verifying token." });
  }
};
