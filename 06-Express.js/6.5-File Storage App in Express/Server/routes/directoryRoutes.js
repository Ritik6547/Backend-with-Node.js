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

router.patch("/:id", async (req, res) => {
  const { newDirname } = req.body;
  const { id } = req.params;

  const dirInfo = foldersData.find((folder) => folder.id === id);
  dirInfo.name = newDirname;

  try {
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    res.json({ msg: "Directory Renamed Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "Directory Not Found" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteDirectory(id);

    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    res.json({ msg: "Directory Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "Directory Not Found" });
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
