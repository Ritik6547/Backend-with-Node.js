import express from "express";
import cors from "cors";
import { createWriteStream } from "node:fs";
import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/directory{/*dirPath}", async (req, res) => {
  const { dirPath } = req.params;
  let dirFullPath = "";
  if (dirPath) {
    dirPath.forEach((p, i) => {
      if (i === dirPath.length - 1) {
        dirFullPath += p;
      } else {
        dirFullPath += p + "/";
      }
    });
  }

  try {
    let filesList = await readdir(`./storage/${dirFullPath}`, {
      withFileTypes: true,
    });
    filesList = filesList.map((item) => {
      return {
        name: item.name,
        isDirectory: item.isDirectory(),
      };
    });
    res.json({ list: filesList });
  } catch (err) {
    res.status(404).json({ statusCode: "404", msg: "Directory Not Found" });
  }
});

app.get("/files/*filePath", (req, res) => {
  const { filePath } = req.params;
  let fileFullPath = "";
  filePath.forEach((p, i) => {
    if (i === filePath.length - 1) {
      fileFullPath += p;
    } else {
      fileFullPath += p + "/";
    }
  });
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${fileFullPath}`);
});

app.post("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const writeStream = createWriteStream(`./storage/${filename}`);
  req.pipe(writeStream);

  req.on("end", () => {
    res.json({ msg: "File Uploaded Successfully" });
  });
});

app.delete("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    await rm(`./storage/${filename}`);
    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.patch("/files/*filePath", async (req, res) => {
  const { newFilename } = req.body;
  const { filePath } = req.params;
  let fileFullPath = "";
  filePath.forEach((p, i) => {
    if (i === filePath.length - 1) {
      fileFullPath += p;
    } else {
      fileFullPath += p + "/";
    }
  });

  const dirPath = path.dirname(fileFullPath);

  await rename(
    `./storage/${fileFullPath}`,
    `./storage/${dirPath}/${newFilename}`
  );
  res.json({ msg: "File Renamed Successfully" });
});

app.listen(port, () => console.log("Server started"));
