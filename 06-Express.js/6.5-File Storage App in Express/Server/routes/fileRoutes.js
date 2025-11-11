import express from "express";
import { createWriteStream } from "node:fs";
import { rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
const { default: filesData } = await import("../filesDB.json", {
  with: { type: "json" },
});
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fileInfo = filesData.find((file) => file.id === id);
  const filename = `${id}${fileInfo.extension}`;

  const storageRoot = path.resolve("./storage");
  const filePath = `${storageRoot}/${filename}`;

  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ msg: "File Not Found" });
    }
  });
});

router.post("/:filename", (req, res) => {
  const { filename } = req.params;
  const parentDirId = req.headers.parentdirid || foldersData[0].id;
  const extension = path.extname(filename);
  const id = crypto.randomUUID();

  const newFilename = `${id}${extension}`;

  const writeStream = createWriteStream(`./storage/${newFilename}`);
  req.pipe(writeStream);

  req.on("end", async () => {
    filesData.push({
      id,
      name: filename,
      extension,
      parentDirId,
    });
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    const folderInfo = foldersData.find((dir) => dir.id === parentDirId);
    folderInfo.files.push(id);
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    res.json({ msg: "File Uploaded Successfully" });
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const fileIndex = filesData.findIndex((file) => file.id === id);
  const fileInfo = filesData[fileIndex];

  const filename = `${id}${fileInfo.extension}`;
  const storageRoot = path.resolve("./storage");
  const filePath = `${storageRoot}/${filename}`;

  try {
    await rm(filePath, { recursive: true });
    filesData.splice(fileIndex, 1);
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    const folderInfo = foldersData.find(
      (dir) => dir.id === fileInfo.parentDirId
    );
    folderInfo.files = folderInfo.files.filter((fileId) => fileId !== id);
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));

    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

router.patch("/:id", async (req, res) => {
  const { newFilename } = req.body;
  const { id } = req.params;
  const ext = path.extname(newFilename);

  const fileInfo = filesData.find((file) => file.id === id);

  try {
    if (ext !== fileInfo.extension) {
      const filename = `${id}${fileInfo.extension}`;
      const storageRoot = path.resolve("./storage");
      const filePath = `${storageRoot}/${filename}`;

      const dirPath = path.dirname(filePath);
      const newFilePath = path.join(dirPath, `${id}${ext}`);
      await rename(filePath, newFilePath);
    }

    fileInfo.name = newFilename;
    fileInfo.extension = ext;

    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.json({ msg: "File Renamed Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

export default router;
