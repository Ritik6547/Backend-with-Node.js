import express from "express";
import { writeFile } from "node:fs/promises";
import checkAuth from "../middleware/auth.js";
const { default: usersData } = await import("../usersDB.json", {
  with: { type: "json" },
});
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  const userIdx = usersData.findIndex((user) => user.email === email);
  if (userIdx !== -1) {
    return res.status(409).json({
      error: "User already exits",
      msg: "A user with this email address already exists.",
    });
  }

  const userId = crypto.randomUUID();
  const dirId = crypto.randomUUID();

  foldersData.push({
    id: dirId,
    name: `root-${email}`,
    userId,
    parentDirId: null,
    files: [],
    directories: [],
  });

  usersData.push({
    id: userId,
    name,
    email,
    password,
    rootDirId: dirId,
  });

  try {
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    await writeFile("./usersDB.json", JSON.stringify(usersData));

    return res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const user = usersData.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  res.cookie("uid", user.id, {
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
