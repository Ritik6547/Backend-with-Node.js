import express from "express";
import checkAuth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  const db = req.db;

  const user = await db.collection("users").findOne({ email });
  if (user) {
    return res.status(409).json({
      error: "User already exits",
      msg: "A user with this email address already exists.",
    });
  }

  try {
    const dirCollection = db.collection("directories");

    const userRootDir = await dirCollection.insertOne({
      name: `root-${email}`,
      parentDirId: null,
    });
    const rootDirId = userRootDir.insertedId;

    const createdUser = await db.collection("users").insertOne({
      name,
      email,
      password,
      rootDirId,
    });
    const userId = createdUser.insertedId;

    await dirCollection.updateOne({ _id: rootDirId }, { $set: { userId } });

    return res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const db = req.db;

  const user = await db.collection("users").findOne({ email, password });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  res.cookie("uid", user._id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });

  res.json({ msg: "Logged In" });
});

router.get("/", checkAuth, (req, res) => {
  const { name, email } = req.user;

  res.status(200).json({ name, email });
});

router.post("/logout", (req, res) => {
  // res.cookie("uid", "", {
  //   maxAge: 0,
  // });
  res.clearCookie("uid");

  res.status(200).json({ msg: "Logged Out" });
});

export default router;
