import express from "express";
import { writeFile } from "node:fs/promises";
const { default: usersData } = await import("../usersDB.json", {
  with: { type: "json" },
});
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.post("/", async (req, res, next) => {
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

export default router;
