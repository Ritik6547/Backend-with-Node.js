import { secretKey } from "../controllers/userController.js";
import User from "../models/userModel.js";
import crypto from "node:crypto";

export default async function checkAuth(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  const [payload, oldSignature] = token.split(".");

  const cookiePayload = Buffer.from(payload, "base64url").toString("utf-8");

  const newSignature = crypto
    .createHash("sha256")
    .update(secretKey)
    .update(cookiePayload)
    .update(secretKey)
    .digest("base64url");

  if (oldSignature !== newSignature) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not Logged In" });
  }

  const { id, expiry: expiryTime } = JSON.parse(cookiePayload);
  const currentTime = Math.round(Date.now() / 1000);

  if (currentTime > expiryTime) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not Logged In" });
  }

  const user = await User.findById(id).lean();
  if (!user) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  req.user = user;
  next();
}
