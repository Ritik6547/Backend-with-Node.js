import express from "express";
import { writeFile } from "node:fs/promises";
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});
const { default: filesData } = await import("../filesDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.get("{/:id}", async (req, res) => {
  const dirId = req.params.id || foldersData[0].id;

  const dirInfo = foldersData.find((folder) => folder.id === dirId);

  const dirFilesData = dirInfo.files.map((fileId) => {
    const { id, name } = filesData.find((file) => file.id === fileId);
    return { id, name };
  });

  const directoriesData = dirInfo.directories.map((dirId) => {
    const { id, name } = foldersData.find((dir) => dir.id === dirId);
    return { id, name };
  });

  res.json({
    ...dirInfo,
    files: dirFilesData,
    directories: directoriesData,
  });
});

router.post("{/:id}", async (req, res) => {
  const parentDirId = req.params.id || foldersData[0].id;
  const { dirname } = req.headers;

  const dir = {
    id: crypto.randomUUID(),
    name: dirname,
    parentDirId,
    files: [],
    directories: [],
  };
  foldersData.push(dir);

  const parentDirInfo = foldersData.find((folder) => folder.id === parentDirId);
  parentDirInfo.directories.push(dir.id);

  try {
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    res.json({ msg: "Directory Created Successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Something Went Wrong" });
  }
});

export default router;
