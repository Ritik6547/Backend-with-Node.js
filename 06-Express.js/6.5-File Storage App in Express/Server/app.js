import express from "express";
import { readdir, rename, rm } from "fs/promises";

const app = express();
const port = 4000;

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });
  next();
});

app.use(express.json());

app.get("/", async (req, res) => {
  const filesList = await readdir("./storage/");
  res.json(filesList);
});

app.get("/:filename", (req, res) => {
  const { filename } = req.params;
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
});

app.delete("/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    await rm(`./storage/${filename}`);
    res.json({ msg: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ msg: "File Not Found" });
  }
});

app.patch("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { newFilename } = req.body;
  await rename(`./storage/${filename}`, `./storage/${newFilename}`);
  res.json({ msg: "File Renamed Successfully" });
});

app.listen(port, () => console.log("Server started"));
