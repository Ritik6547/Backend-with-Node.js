import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;

  if (!uid) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  const user = await User.findById(uid).lean();
  if (!user) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  req.user = user;
  next();
}
