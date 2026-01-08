import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;

  if (!token) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not Logged In" });
  }

  const { id, expiry: expiryTime } = JSON.parse(
    Buffer.from(token, "base64url").toString()
  );
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
