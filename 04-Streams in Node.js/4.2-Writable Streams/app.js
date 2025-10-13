import fs from "node:fs";

const readStream = fs.createReadStream(
  "E:\\VIDEOS\\MONEY HEIST\\SEASON 5\\Vol 2\\ep-7.mkv",
  {
    highWaterMark: 1 * 1024 * 1024,
  }
);
const writeStream = fs.createWriteStream("mh.mkv");

console.time();
readStream.on("data", (chunk) => {
  const isEmpty = writeStream.write(chunk);
  if (!isEmpty) {
    readStream.pause();
  }
});

writeStream.on("drain", () => {
  readStream.resume();
});

readStream.on("end", () => {
  writeStream.end();
  console.timeEnd();
});
