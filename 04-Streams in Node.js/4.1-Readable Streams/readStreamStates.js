import fs from "node:fs";

const readStream = fs.createReadStream("./chars.txt", { highWaterMark: 4 });

// console.log(readStream.readableFlowing);
// console.log(readStream.readableEnded);
// console.log(readStream.isPaused());

readStream.on("data", (chunk) => {
  readStream.pause();
  if (readStream.bytesRead === readStream.readableHighWaterMark) {
    fs.writeFileSync("abc.txt", chunk);
  } else {
    fs.appendFileSync("abc.txt", chunk);
  }
  setTimeout(() => {
    readStream.resume();
  }, 100);
});

readStream.on("pause", () => {
  console.log("Stream Paused");
});

readStream.on("resume", () => {
  console.log("Stream Resumed");
});
