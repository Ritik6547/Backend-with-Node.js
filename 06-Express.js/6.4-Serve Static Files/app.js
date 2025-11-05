import express from "express";
import { open } from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/test", async (req, res) => {
  //   const fileHandle = await open("./awara.mp4");
  //   const readStream = fileHandle.createReadStream();
  //   const stats = await fileHandle.stat();
  //   res.setHeader("Content-Length", stats.size);
  //   res.setHeader("Content-Type", "video/mp4");
  //   res.setHeader("Content-Disposition", `inline; filename="awara.mp4"`);
  //   readStream.pipe(res);

  res.sendFile(`${import.meta.dirname}/awara.mp4`);
});

// sending json
app.get("/abc", (req, res) => {
  //   res.setHeader("Content-Type", "application/json");
  //   res.end(JSON.stringify({ msg: "hello" }));

  res.status(200).json({ msg: "hello" });
});

app.listen(port, () => console.log("Server started"));
