import express from "express";
import { mkdir, readdir } from "node:fs/promises";
import { preventPathTraversal } from "../utils/preventPathTraversal.js";

const router = express.Router();

router.get("{/*dirPath}", async (req, res) => {
  const { dirPath } = req.params;
  const dirFullPath = dirPath ? dirPath.join("/") : "";

  const requestedPath = preventPathTraversal(res, dirFullPath);
  if (!requestedPath) return;

  try {
    let dirItems = await readdir(requestedPath, {
      withFileTypes: true,
    });
    dirItems = dirItems.map((item) => {
      return {
        name: item.name,
        isDirectory: item.isDirectory(),
      };
    });
    res.json({ dirItems });
  } catch (err) {
    res.status(404).json({ statusCode: "404", msg: "Directory Not Found" });
  }
});

router.post("/*dirPath", async (req, res) => {
  const { dirPath } = req.params;
  const dirFullPath = dirPath ? dirPath.join("/") : "";

  const requestedPath = preventPathTraversal(res, dirFullPath);
  if (!requestedPath) return;

  try {
    await mkdir(requestedPath);
    res.json({ msg: "Directory Created Successfully" });
  } catch (err) {
    res.json({ msg: "Something Went Wrong" });
  }
});

export default router;
