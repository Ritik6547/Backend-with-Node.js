import { open, readdir, readFile } from "node:fs/promises";
import http from "node:http";

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return res.end("No favicon");
  console.log(req.url);
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const reqUrl = decodeURIComponent(req.url);
      const fileHandle = await open(`./storage${reqUrl}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (err) {
      console.log(err.message);
      res.end("Not Found");
    }
  }
});

async function serveDirectory(req, res) {
  const folderItems = await readdir(`./storage${req.url}`);
  let dynamicHTML = "";
  folderItems.forEach((item) => {
    dynamicHTML += `<li><a href=".${
      req.url === "/" ? "" : req.url
    }/${item}">${item}</a></li>`;
  });

  const htmlBoilerPlate = await readFile("./boilerplate.html", "utf-8");
  res.end(htmlBoilerPlate.replace("${dynamicHTML}", dynamicHTML));
}

server.listen(4000, "0.0.0.0", () => {
  console.log(`Server is running on port 4000`);
});
