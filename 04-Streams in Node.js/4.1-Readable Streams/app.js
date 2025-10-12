import fsPromises from "node:fs/promises";
import fs from "node:fs";

// const contentBuffer = await fsPromises.readFile(
//   "E:\\VIDEOS\\MONEY HEIST\\SEASON 5\\Vol 2\\Money.Heist.S05.E06.1080p.WEB-DL.Hindi-English.DD5.1.ESub.x264-Vegamovies.NL.mkv"
// );
// fsPromises.writeFile("mh.mkv", contentBuffer);

const readStream = fs.createReadStream(
  "E:\\VIDEOS\\MONEY HEIST\\SEASON 5\\Vol 2\\Money.Heist.S05.E07.1080p.WEB-DL.Hindi-English.DD5.1.ESub.x264-Vegamovies.NL.mkv",
  { highWaterMark: 1 * 1024 * 1024 }
);

console.time();
let readCount = 0;
readStream.on("data", (chunkBuffer) => {
  readCount++;
  console.log(`Reading : ${((readCount / 2136) * 100).toFixed(2)}%`);
  fs.appendFileSync("mh.mkv", chunkBuffer);
});

readStream.on("end", () => {
  console.log({ readCount });
  console.timeEnd();
});
