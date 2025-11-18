import express from "express";
import mime from "mime-types";
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
  const user = req.user;

  const fileInfo = filesData.find((file) => file.id === id);
  if (!fileInfo) {
    return res.status(404).json({ msg: "File Not Found" });
  }

  const parentDir = foldersData.find((dir) => dir.id === fileInfo.parentDirId);
  if (parentDir.userId !== user.id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const filename = `${id}${fileInfo.extension}`;
  const storageRoot = path.resolve("./storage");
  const filePath = `${storageRoot}/${filename}`;

  const headers = {};
  if (req.query.action === "download") {
    headers["Content-Disposition"] = `attachment; filename="${fileInfo.name}"`;
  } else {
    let contentType = mime.contentType(fileInfo.name);
    if (contentType === "application/mp4") {
      contentType = "video/mp4";
    }
    headers["Content-Type"] = contentType;
  }

  return res.sendFile(filePath, { headers }, (err) => {
    if (err && !res.headersSent) {
      return res.status(404).json({ msg: "File Not Found" });
    }
  });
});

router.post("{/:id}", (req, res) => {
  const user = req.user;
  const parentDirId = req.params.id || user.rootDirId;
  const filename = req.headers.filename || "untitled";

  const parentDir = foldersData.find((dir) => dir.id === parentDirId);
  if (!parentDir) {
    return res.status(404).json({ msg: "No Such Directory Exist" });
  }

  if (parentDir.userId !== user.id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

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

    parentDir.files.push(id);

    try {
      await writeFile("./filesDB.json", JSON.stringify(filesData));
      await writeFile("./foldersDB.json", JSON.stringify(foldersData));
      return res.status(201).json({ msg: "File Uploaded Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: "Unable to save file" });
    }
  });
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const fileIndex = filesData.findIndex((file) => file.id === id);
  if (fileIndex === -1) {
    return res.status(404).json({ msg: "File Not Found" });
  }
  const fileInfo = filesData[fileIndex];

  const parentDir = foldersData.find((dir) => dir.id === fileInfo.parentDirId);
  if (parentDir.userId !== user.id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const filename = `${id}${fileInfo.extension}`;
  const storageRoot = path.resolve("./storage");
  const filePath = `${storageRoot}/${filename}`;

  try {
    await rm(filePath);
    filesData.splice(fileIndex, 1);

    parentDir.files = parentDir.files.filter((fileId) => fileId !== id);

    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));

    return res.status(200).json({ msg: "File Deleted Successfully" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { newFilename } = req.body;
  const { id } = req.params;
  const ext = path.extname(newFilename);

  const fileInfo = filesData.find((file) => file.id === id);
  if (!fileInfo) {
    return res.status(404).json({ msg: "File Not Found" });
  }

  const parentDir = foldersData.find((dir) => dir.id === fileInfo.parentDirId);
  if (parentDir.userId !== user.id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

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
    return res.status(200).json({ msg: "File Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
