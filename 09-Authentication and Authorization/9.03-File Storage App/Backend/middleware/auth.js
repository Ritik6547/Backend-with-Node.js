import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
    res.clearCookie("sid");
    return res.status(401).json({ error: "Not Logged In" });
  }

  const session = await Session.findById(sid).lean();
  if (!session) {
    res.clearCookie("sid");
    return res.status(401).json({ error: "Not Logged In" });
  }

  const user = await User.findById(session.userId).lean();
  if (!user) {
    // Delete Orphaned Sessions
    await Session.findByIdAndDelete(session._id);
    res.clearCookie("sid");

    return res.status(401).json({ error: "Not Logged In" });
  }

  req.user = user;
  next();
}
