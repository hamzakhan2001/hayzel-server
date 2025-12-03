import dotenv from "dotenv";
dotenv.config();

const parseTrusted = () =>
  process.env.TRUSTED_IPS
    ? process.env.TRUSTED_IPS.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

function normalizeIp(raw) {
  if (!raw) return "";
  // if multiple IPs, use first one
  if (raw.includes(",")) raw = raw.split(",")[0].trim();
  // IPv6-mapped IPv4
  if (raw.startsWith("::ffff:")) raw = raw.replace("::ffff:", "");
  // Convert IPv6 localhost to IPv4 for matching
  if (raw === "::1") raw = "127.0.0.1";
  return raw;
}

export const ipWhitelist = (req, res, next) => {
  const trusted = parseTrusted(); // allowed IPs from .env

  const remote =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    "";

  const clientIp = normalizeIp(remote);

  console.log("📡 Request from IP (raw):", remote, "→ normalized:", clientIp);

  // Protect admin routes only
  if (req.originalUrl.startsWith("/api/admin")) {
    const allowed =
      process.env.NODE_ENV === "development" || // ✅ allow local dev
      trusted.some((ip) => clientIp.includes(ip));

    if (!allowed) {
      console.warn("🚫 Access denied for IP:", clientIp);
      return res
        .status(403)
        .json({ message: "Access denied: Unauthorized network" });
    }
  }

  next();
};
