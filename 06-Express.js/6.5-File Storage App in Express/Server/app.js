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

  try {
    let dirItems = await readdir(`./storage/${dirFullPath}`, {
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
  const dirFullPath = dirPath.join("/");

  try {
    await mkdir(`./storage/${dirFullPath}`);
    res.json({ msg: "Directory Created Successfully" });
  } catch (err) {
    res.json({ msg: "Something Went Wrong" });
  }
});

app.get("/files/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  try {
    res.sendFile(`${import.meta.dirname}/storage/${fileFullPath}`);
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.post("/files/*filePath", (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  const writeStream = createWriteStream(`./storage/${fileFullPath}`);
  req.pipe(writeStream);

  req.on("end", () => {
    res.json({ msg: "File Uploaded Successfully" });
  });
});

app.delete("/files/*filePath", async (req, res) => {
  const { filePath } = req.params;
  const fileFullPath = filePath.join("/");

  try {
    await rm(`./storage/${fileFullPath}`, { recursive: true });
    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.patch("/files/*filePath", async (req, res) => {
  const { newFilename } = req.body;
  const { filePath } = req.params;

  const fileFullPath = filePath.join("/");
  const dirPath = path.dirname(fileFullPath);

  try {
    await rename(
      `./storage/${fileFullPath}`,
      `./storage/${dirPath}/${newFilename}`
    );
    res.json({ msg: "File Renamed Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.listen(port, () => console.log("Server started"));
