import fs from "node:fs/promises";

const readFileHandle = await fs.open(
  "E:\\VIDEOS\\MONEY HEIST\\SEASON 5\\Vol 2\\ep-7.mkv"
);

const writeFileHandle = await fs.open("mh.mkv", "w");

const readStream = readFileHandle.createReadStream({
  highWaterMark: 1 * 1024 * 1024,
});
const writeStream = writeFileHandle.createWriteStream();

readStream.pipe(writeStream);
