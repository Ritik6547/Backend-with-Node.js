import express from "express";
import path from "node:path";
import { rm, writeFile } from "node:fs/promises";
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});
const { default: filesData } = await import("../filesDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.get("{/:id}", (req, res) => {
  const dirId = req.params.id || foldersData[0].id;

  const dirInfo = foldersData.find((folder) => folder.id === dirId);
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  const dirFilesData = dirInfo.files.map((fileId) => {
    const { id, name } = filesData.find((file) => file.id === fileId);
    return { id, name };
  });

  const directoriesData = dirInfo.directories.map((dirId) => {
    const { id, name } = foldersData.find((dir) => dir.id === dirId);
    return { id, name };
  });

  return res.status(200).json({
    ...dirInfo,
    files: dirFilesData,
    directories: directoriesData,
  });
});

router.post("{/:id}", async (req, res, next) => {
  const parentDirId = req.params.id || foldersData[0].id;
  const dirname = req.headers.dirname || "New Folder";

  const parentDirInfo = foldersData.find((folder) => folder.id === parentDirId);
  if (!parentDirInfo) {
    return res.status(404).json({ msg: "Parent Directory Not Found" });
  }

  const dir = {
    id: crypto.randomUUID(),
    name: dirname,
    parentDirId,
    files: [],
    directories: [],
  };
  foldersData.push(dir);

  parentDirInfo.directories.push(dir.id);

  try {
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    return res.status(201).json({ msg: "Directory Created Successfully" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { newDirname } = req.body;
  console.log(newDirname);
  const { id } = req.params;

  const dirInfo = foldersData.find((folder) => folder.id === id);
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }
  dirInfo.name = newDirname;

  try {
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    return res.status(200).json({ msg: "Directory Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await deleteDirectory(id);

    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    res.status(200).json({ msg: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

async function deleteDirectory(id) {
  const dirIndex = foldersData.findIndex((folder) => folder.id === id);

  const dirInfo = foldersData[dirIndex];
  const parentDirInfo = foldersData.find(
    (folder) => folder.id === dirInfo.parentDirId
  );

  parentDirInfo.directories = parentDirInfo.directories.filter(
    (dirId) => dirId !== id
  );

  for (const fileId of dirInfo.files) {
    const fileIndex = filesData.findIndex((file) => file.id === fileId);
    const fileInfo = filesData[fileIndex];

    const filename = `${fileId}${fileInfo.extension}`;
    const storageRoot = path.resolve("./storage");
    const filePath = `${storageRoot}/${filename}`;

    await rm(filePath);
    filesData.splice(fileIndex, 1);
  }

  for (const dirId of dirInfo.directories) {
    await deleteDirectory(dirId);
  }

  foldersData.splice(dirIndex, 1);
}

export default router;
