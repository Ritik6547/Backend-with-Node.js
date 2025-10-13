import fs from "node:fs";

const readStream = fs.createReadStream("./chars.txt", {
  highWaterMark: 4,
  encoding: "utf-8",
});

// readStream.setEncoding("utf-8");

readStream.on("data", (chunk) => {
  console.log(chunk);
});

readStream.on("close", () => {
  console.log("Closed");
});

readStream.on("end", () => {
  console.log("End");
});

readStream.on("error", (err) => {
  console.log(err);
});

readStream.on("open", (data) => {
  console.log("Opened", data);
});

readStream.destroy("error occured");
