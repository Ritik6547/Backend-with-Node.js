import { rm } from "node:fs";
import path from "node:path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const getDirectory = async (req, res) => {
  const user = req.user;
  const dirId = req.params.id || user.rootDirId.toString();

  const dirInfo = await Directory.findById(dirId).lean();
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  if (dirInfo.userId.toString() !== user._id.toString()) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  const dirFilesData = await File.find({ parentDirId: dirId }).lean();

  const directoriesData = await Directory.find({ parentDirId: dirId }).lean();

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
};

export const createDirectory = async (req, res, next) => {
  const user = req.user;
  const parentDirId = req.params.id || user.rootDirId.toString();
  const dirname = req.headers.dirname || "New Folder";

  try {
    const parentDirInfo = await Directory.findOne({
      _id: parentDirId,
      userId: user._id,
    }).lean();
    if (!parentDirInfo) {
      return res.status(404).json({ msg: "Directory Not Found" });
    }

    await Directory.create({
      name: dirname,
      userId: user._id,
      parentDirId,
    });

    return res.status(201).json({ msg: "Directory Created Successfully" });
  } catch (err) {
    next(err);
  }
};

export const renameDirectory = async (req, res, next) => {
  const user = req.user;
  const { newDirname } = req.body;
  const { id } = req.params;

  try {
    const result = await Directory.findOneAndUpdate(
      { _id: id, userId: user._id },
      { name: newDirname }
    ).lean();
    if (!result) {
      return res.status(404).json({ msg: "Directory Not Found" });
    }

    return res.status(200).json({ msg: "Directory Renamed Successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteDirectory = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  const dirInfo = await Directory.findOne({
    _id: id,
    userId: user._id,
  })
    .select("_id")
    .lean();
  console.log(dirInfo);
  if (!dirInfo) {
    return res.status(404).json({ msg: "Directory Not Found" });
  }

  try {
    await deleteDir(dirInfo._id);

    res.status(200).json({ msg: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

async function deleteDir(id) {
  const storageRoot = path.resolve("./storage");

  const fileCursor = File.find({ parentDirId: id }).cursor();

  for await (const file of fileCursor) {
    const filename = `${file._id}${file.extension}`;
    const filePath = path.join(storageRoot, filename);

    try {
      await rm(filePath);
    } catch (err) {
      console.error("Failed to delete file:", filePath);
    }

    await File.deleteOne({ _id: file._id });
  }

  const dirCursor = Directory.find({ parentDirId: id }).cursor();
  for await (const dir of dirCursor) {
    await deleteDir(dir._id);
  }

  await Directory.deleteOne({ _id: id });
}
