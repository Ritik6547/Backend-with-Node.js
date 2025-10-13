import fs from "node:fs";

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });

console.log(writeStream.writable);

writeStream.write("a");
writeStream.write("a");
writeStream.write("a");
writeStream.write("a");

writeStream.end("b");
console.log(writeStream.writable);
console.log(writeStream.writableEnded);
console.log(writeStream.writableFinished);

setTimeout(() => {
  console.log(writeStream.writableFinished);
}, 10);

// writeStream.write("z");

writeStream.on("open", (fd) => {
  console.log("File is Opened", { fd });
});

writeStream.on("close", () => {
  console.log("File is Closed");
});

writeStream.on("finish", () => console.log("Finished"));

writeStream.on("error", (err) => {
  console.log(err);
});
