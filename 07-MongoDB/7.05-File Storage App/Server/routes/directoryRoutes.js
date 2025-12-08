import express from "express";
import path from "node:path";
import { rm, writeFile } from "node:fs/promises";
import validateIdMiddleware from "../middleware/validateIdMiddleware.js";
import { Db, ObjectId } from "mongodb";
const { default: foldersData } = await import("../foldersDB.json", {
  with: { type: "json" },
});
const { default: filesData } = await import("../filesDB.json", {
  with: { type: "json" },
});

const router = express.Router();

router.param("id", validateIdMiddleware);

// Get Directory
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

  const dirFilesData = [];

  const directoriesData = await dirCollection
    .find({ parentDirId: dirId })
    .toArray();

  return res.status(200).json({
    ...dirInfo,
    files: dirFilesData,
    directories: directoriesData.map((dir) => ({
      name: dir.name,
      id: dir._id,
    })),
  });
});

// Create Directory
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

// Update Directory
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

// Delete Directory
router.delete("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  const dirInfo = foldersData.find((dir) => dir.id === id);
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  if (dirInfo.userId !== user.id) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

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
