import fs from "node:fs";
import { pipeline } from "node:stream";

const readStream = fs.createReadStream(
  "E:\\VIDEOS\\MONEY HEIST\\SEASON 5\\Vol 2\\ep-7.mkv",
  { highWaterMark: 1 * 1024 * 1024 }
);

const writeStream = fs.createWriteStream("money.mkv");

pipeline(readStream, writeStream, (err) => {
  console.log(err);
});

setTimeout(() => {
  readStream.destroy("Error Occured");
}, 1000);

setInterval(() => {
  console.log("Hii");
}, 100);
