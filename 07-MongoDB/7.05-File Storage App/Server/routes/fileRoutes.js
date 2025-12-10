import express from "express";
import { createWriteStream } from "node:fs";
import { rm, unlink } from "node:fs/promises";
import path from "node:path";
import validateIdMiddleware from "../middleware/validateIdMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateIdMiddleware);

// Get file
router.get("/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const user = req.user;

  const fileInfo = await db
    .collection("files")
    .findOne({ _id: new ObjectId(id), userId: user._id });
  if (!fileInfo) {
    return res.status(404).json({ msg: "File Not Found" });
  }

  const filename = `${id}${fileInfo.extension}`;
  const storageRoot = path.resolve("./storage");
  const filePath = `${storageRoot}/${filename}`;

  if (req.query.action === "download") {
    return res.download(filePath, fileInfo.name);
  }

  return res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      return res.status(404).json({ msg: "File Not Found" });
    }
  });
});

// Upload file
router.post("/{:id}", async (req, res) => {
  const db = req.db;
  const user = req.user;
  const parentDirId = req.params.id
    ? new ObjectId(req.params.id)
    : user.rootDirId;
  const filename = req.headers.filename || "untitled";

  try {
    const parentDir = await db
      .collection("directories")
      .findOne({ _id: parentDirId, userId: user._id });
    if (!parentDir) {
      return res.status(404).json({ msg: "No Such Directory Exist" });
    }

    const extension = path.extname(filename);

    const savedFile = await db.collection("files").insertOne({
      name: filename,
      extension,
      parentDirId,
      userId: user._id,
    });

    const fileId = savedFile.insertedId.toString();
    const newFilename = `${fileId}${extension}`;

    const writeStream = createWriteStream(`./storage/${newFilename}`);
    req.pipe(writeStream);

    req.on("end", () => {
      return res.status(201).json({ msg: "File Uploaded Successfully" });
    });

    req.on("error", async () => {
      await db.collection("files").deleteOne({ _id: savedFile.insertedId });
      unlink(`./storage/${newFilename}`);
      return res.status(404).json({ msg: "File not Uploaded" });
    });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to save file" });
  }
});

// Delete file
router.delete("/:id", async (req, res, next) => {
  const db = req.db;
  const { id } = req.params;
  const user = req.user;

  try {
    const fileInfo = await db
      .collection("files")
      .findOne({ _id: new ObjectId(id), userId: user._id });
    if (!fileInfo) {
      return res.status(404).json({ msg: "File Not Found" });
    }

    const filename = `${id}${fileInfo.extension}`;
    const storageRoot = path.resolve("./storage");
    const filePath = `${storageRoot}/${filename}`;

    await rm(filePath);

    await db.collection("files").deleteOne({ _id: new ObjectId(id) });

    return res.status(200).json({ msg: "File Deleted Successfully" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

// Rename file
router.patch("/:id", async (req, res, next) => {
  const db = req.db;
  const user = req.user;
  const { newFilename } = req.body;
  const { id } = req.params;

  try {
    const fileInfo = await db
      .collection("files")
      .findOne({ _id: new ObjectId(id), userId: user._id });
    if (!fileInfo) {
      return res.status(404).json({ msg: "File Not Found" });
    }

    await db
      .collection("files")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name: newFilename } });

    return res.status(200).json({ msg: "File Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
