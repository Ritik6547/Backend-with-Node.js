import { open, readdir } from "node:fs/promises";
import http from "node:http";
import mime from "mime-types";
import { createWriteStream } from "node:fs";

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  console.log(req.method);

  if (req.method === "GET") {
    if (req.url === "/favicon.ico") return res.end("No favicon");

    console.log(req.url);
    if (req.url === "/") {
      serveDirectory(req, res);
    } else {
      try {
        const [url, queryString] = req.url.split("?");
        const queryParams = {};
        queryString?.split("&").forEach((param) => {
          const [key, val] = param.split("=");
          queryParams[key] = val;
        });

        const reqUrl = decodeURIComponent(url);
        const fileHandle = await open(`./storage${reqUrl}`);
        const stats = await fileHandle.stat();
        if (stats.isDirectory()) {
          serveDirectory(req, res);
        } else {
          const readStream = fileHandle.createReadStream();
          let type = mime.contentType(reqUrl.slice(1));
          if (type === "application/mp4") type = "video/mp4";
          res.setHeader("Content-Type", type);
          res.setHeader("Content-Length", stats.size);

          if (queryParams.action === "download") {
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${url.slice(1)}"`
            );
          }
          readStream.pipe(res);
        }
      } catch (err) {
        console.log(err.message);
        res.end("Not Found");
      }
    }
  } else if (req.method === "OPTIONS") {
    res.end("OK");
  } else if (req.method === "POST") {
    const writeStream = createWriteStream(`./storage/${req.headers.filename}`);
    req.pipe(writeStream);

    req.on("end", () => {
      res.end(JSON.stringify({ data: "File Uploaded Successfully" }));
    });
  }
});

async function serveDirectory(req, res) {
  const [url] = req.url.split("?");
  const folderItems = await readdir(`./storage${decodeURIComponent(url)}`);

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(folderItems));
}

server.listen(4000, "0.0.0.0", () => {
  console.log(`Server is running on port 4000`);
});
