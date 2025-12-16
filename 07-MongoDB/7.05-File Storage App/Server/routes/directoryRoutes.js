import express from "express";
import path from "node:path";
import { rm } from "node:fs/promises";
import validateIdMiddleware from "../middleware/validateIdMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateIdMiddleware);

// Get directory
router.get("/{:id}", async (req, res) => {
  const user = req.user;
  const db = req.db;
  const dirId = req.params.id ? new ObjectId(req.params.id) : user.rootDirId;

  const dirCollection = db.collection("directories");

  const dirInfo = await dirCollection.findOne({ _id: dirId });
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  if (dirInfo.userId.toString() !== user._id.toString()) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const dirFilesData = await db
    .collection("files")
    .find({ parentDirId: dirId })
    .toArray();

  const directoriesData = await dirCollection
    .find({ parentDirId: dirId })
    .toArray();

  return res.status(200).json({
    ...dirInfo,
    files: dirFilesData.map((file) => ({
      name: file.name,
      id: file._id,
    })),
    directories: directoriesData.map((dir) => ({
      name: dir.name,
      id: dir._id,
    })),
  });
});

// Create directory
router.post("/{:id}", async (req, res, next) => {
  const user = req.user;
  const db = req.db;
  const parentDirId = req.params.id
    ? new ObjectId(req.params.id)
    : user.rootDirId;
  const dirname = req.headers.dirname || "New Folder";

  const dirCollection = db.collection("directories");

  try {
    const parentDirInfo = await dirCollection.findOne({ _id: parentDirId });
    if (!parentDirInfo) {
      return res.status(404).json({ msg: "Parent Directory Not Found" });
    }

    if (parentDirInfo.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Unauthorized Access" });
    }

    await dirCollection.insertOne({
      name: dirname,
      userId: user._id,
      parentDirId,
    });

    return res.status(201).json({ msg: "Directory Created Successfully" });
  } catch (err) {
    next(err);
  }
});

// Rename directory
router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const db = req.db;
  const { newDirname } = req.body;
  const { id } = req.params;

  try {
    const result = await db
      .collection("directories")
      .updateOne(
        { _id: new ObjectId(id), userId: user._id },
        { $set: { name: newDirname } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: "Directory Not Found" });
    }

    return res.status(200).json({ msg: "Directory Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

// Delete directory
router.delete("/:id", async (req, res, next) => {
  const db = req.db;
  const user = req.user;
  const { id } = req.params;

  const dirCollection = db.collection("directories");

  const dirInfo = await dirCollection.findOne(
    {
      _id: new ObjectId(id),
      userId: user._id,
    },
    { projection: { _id: 1 } }
  );
  console.log(dirInfo);
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  try {
    await deleteDirectory(dirInfo._id, db);

    res.status(200).json({ msg: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

async function deleteDirectory(id, db) {
  const storageRoot = path.resolve("./storage");

  const fileCursor = db.collection("files").find({ parentDirId: id });

  for await (const file of fileCursor) {
    const filename = `${file._id.toString()}${file.extension}`;
    const filePath = path.join(storageRoot, filename);

    try {
      await rm(filePath);
    } catch (err) {
      console.error("Failed to delete file:", filePath);
    }

    await db.collection("files").deleteOne({ _id: file._id });
  }

  const dirCursor = db.collection("directories").find({ parentDirId: id });
  for await (const dir of dirCursor) {
    await deleteDirectory(dir._id, db);
  }

  await db.collection("directories").deleteOne({ _id: id });
}

export default router;
