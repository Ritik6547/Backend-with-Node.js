import fs from "node:fs";

const readStream = fs.createReadStream("./chars.txt", { highWaterMark: 4 });

let readCount = 0;
readStream.on("data", (chunk) => {
  console.log(chunk.byteLength);
  readCount++;
});

readStream.on("end", () => {
  console.log({ readCount });
});
