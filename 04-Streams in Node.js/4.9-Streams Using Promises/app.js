import fs from "node:fs/promises";

const fileHandle = await fs.open("text.txt", "r+");

const readStream = fileHandle.createReadStream({
  highWaterMark: 2,
  encoding: "utf-8",
});

readStream.on("data", (chunk) => {
  console.log(chunk);
});

readStream.on("end", () => {
  console.log("Finished Reading");
  const writeStream = fileHandle.createWriteStream();
  writeStream.write("wxyz");
  console.log("Wrote to file");
});
