import express from "express";
import cors from "cors";
import { createWriteStream } from "node:fs";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/directory{/*dirPath}", async (req, res) => {
  const { dirPath } = req.params;
  const dirFullPath = dirPath ? dirPath.join("/") : "";

  const requestedPath = preventPathTraversal(res, dirFullPath);
  if (!requestedPath) return;

  try {
    let dirItems = await readdir(requestedPath, {
      withFileTypes: true,
    });
    dirItems = dirItems.map((item) => {
      return {
        name: item.name,
        isDirectory: item.isDirectory(),
      };
    });
    res.json({ dirItems });
  } catch (err) {
    res.status(404).json({ statusCode: "404", msg: "Directory Not Found" });
  }
});

app.post("/directory/*dirPath", async (req, res) => {
  const { dirPath } = req.params;
  const dirFullPath = dirPath ? dirPath.join("/") : "";

  const requestedPath = preventPathTraversal(res, dirFullPath);
  if (!requestedPath) return;

  try {
    await mkdir(requestedPath);
    res.json({ msg: "Directory Created Successfully" });
  } catch (err) {
    res.json({ msg: "Something Went Wrong" });
  }
});

app.get("/files/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(requestedPath, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ msg: "File Not Found" });
    }
  });
});

app.post("/files/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  const writeStream = createWriteStream(requestedPath);
  req.pipe(writeStream);

  req.on("end", () => {
    res.json({ msg: "File Uploaded Successfully" });
  });
});

app.delete("/files/*filePath", async (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  try {
    await rm(requestedPath, { recursive: true });
    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.patch("/files/*filePath", async (req, res) => {
  const { newFilename } = req.body;
  const { filePath } = req.params;

  const fileFullPath = filePath.join("/");
  const requestedPath = preventPathTraversal(res, fileFullPath);
  if (!requestedPath) return;

  const dirPath = path.dirname(requestedPath);

  try {
    await rename(requestedPath, path.join(dirPath, newFilename));
    res.json({ msg: "File Renamed Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

function preventPathTraversal(res, filePath) {
  const storageRoot = path.resolve("./storage");
  const requestedPath = path.resolve(storageRoot, filePath);

  // Prevent traversal
  if (!requestedPath.startsWith(storageRoot)) {
    res.status(400).json({ msg: "Invalid file path" });
    return null;
  }

  return requestedPath;
}

app.listen(port, () => console.log("Server started"));
