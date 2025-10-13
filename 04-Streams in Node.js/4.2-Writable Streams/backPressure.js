import fs from "node:fs";

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });

for (let i = 0; i < 4; i++) {
  console.log(writeStream.writableLength);
  const isEmpty = writeStream.write("a");
  console.log(isEmpty);
}

writeStream.on("drain", () => {
  console.log(writeStream.writableLength);
});
