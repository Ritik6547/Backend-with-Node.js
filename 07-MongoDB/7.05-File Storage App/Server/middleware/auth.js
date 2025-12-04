import { Db, ObjectId } from "mongodb";

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;
  const db = req.db;

  if (!uid) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  const user = await db.collection("users").findOne({ _id: new ObjectId(uid) });
  if (!user) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  req.user = user;
  next();
}
