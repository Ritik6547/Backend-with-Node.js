import express from "express";
import { createWriteStream } from "node:fs";
import { rename, rm } from "node:fs/promises";
import path from "node:path";
import { preventPathTraversal } from "../utils/preventPathTraversal.js";

const router = express.Router();

router.get("/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(requestedPath, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ msg: "File Not Found" });
    }
  });
});

router.post("/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  const writeStream = createWriteStream(requestedPath);
  req.pipe(writeStream);

  req.on("end", () => {
    res.json({ msg: "File Uploaded Successfully" });
  });
});

router.delete("/*filePath", async (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  try {
    await rm(requestedPath, { recursive: true });
    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

router.patch("/*filePath", async (req, res) => {
  const { newFilename } = req.body;
  const { filePath } = req.params;

  const fileFullPath = filePath.join("/");
  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  const dirPath = path.dirname(requestedPath);

  try {
    await rename(requestedPath, path.join(dirPath, newFilename));
    res.json({ msg: "File Renamed Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

export default router;
