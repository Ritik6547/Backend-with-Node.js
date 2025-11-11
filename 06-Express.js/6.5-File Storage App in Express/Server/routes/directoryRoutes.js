import express from "express";
import { mkdir } from "node:fs/promises";
import { preventPathTraversal } from "../utils/preventPathTraversal.js";
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});
const { default: filesData } = await import("../filesDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.get("{/:id}", async (req, res) => {
  const dirId = req.params.id ? req.params.id : foldersData[0].id;

  const folderInfo = foldersData.find((folder) => folder.id === dirId);

  const folderFileData = folderInfo.files.map((fileId) =>
    filesData.find((file) => file.id === fileId)
  );

  res.json({ ...folderInfo, files: folderFileData });
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
