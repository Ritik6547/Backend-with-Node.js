import fs from "node:fs";

const readStream = fs.createReadStream("./chars.txt", { highWaterMark: 8 });

// readStream.on("data", (chunk) => {
//   console.log(chunk);
// });

readStream.on("readable", () => {
  console.log(readStream.readableLength);
  console.log(readStream.read(6));
  console.log(readStream.readableLength);
});
