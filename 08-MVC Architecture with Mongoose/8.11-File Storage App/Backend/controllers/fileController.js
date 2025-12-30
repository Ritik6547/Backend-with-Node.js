import { createWriteStream } from "node:fs";
import { rm, unlink } from "node:fs/promises";
import path from "node:path";
import File from "../models/fileModel.js";
import Directory from "../models/directoryModel.js";

export const getFile = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const fileInfo = await File.findOne({ _id: id, userId: user._id }).lean();
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
};

export const uploadFile = async (req, res) => {
  const user = req.user;
  const parentDirId = req.params.id || user.rootDirId.toString();
  const filename = req.headers.filename || "untitled";

  try {
    const parentDir = await Directory.findOne({
      _id: parentDirId,
      userId: user._id,
    }).lean();
    if (!parentDir) {
      return res.status(404).json({ msg: "No Such Directory Exist" });
    }

    const extension = path.extname(filename);

    const savedFile = await File.create({
      name: filename,
      extension,
      parentDirId,
      userId: user._id,
    });

    const fileId = savedFile._id;
    const newFilename = `${fileId}${extension}`;

    const writeStream = createWriteStream(`./storage/${newFilename}`);
    req.pipe(writeStream);

    req.on("end", () => {
      return res.status(201).json({ msg: "File Uploaded Successfully" });
    });

    req.on("error", async () => {
      await File.deleteOne({ _id: savedFile._id });
      await unlink(`./storage/${newFilename}`);
      return res.status(404).json({ msg: "File not Uploaded" });
    });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to save file" });
  }
};

export const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const fileInfo = await File.findOne({ _id: id, userId: user._id }).select(
      "extension"
    );
    if (!fileInfo) {
      return res.status(404).json({ msg: "File Not Found" });
    }

    const filename = `${id}${fileInfo.extension}`;
    const storageRoot = path.resolve("./storage");
    const filePath = `${storageRoot}/${filename}`;

    await rm(filePath);

    await fileInfo.deleteOne();

    return res.status(200).json({ msg: "File Deleted Successfully" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const renameFile = async (req, res, next) => {
  const user = req.user;
  const { newFilename } = req.body;
  const { id } = req.params;

  try {
    const fileInfo = await File.findOne({ _id: id, userId: user._id });
    if (!fileInfo) {
      return res.status(404).json({ msg: "File Not Found" });
    }

    fileInfo.name = newFilename;
    await fileInfo.save();

    return res.status(200).json({ msg: "File Renamed Successfully" });
  } catch (err) {
    next(err);
  }
};
