import fs from "node:fs/promises";

const fileHandle = await fs.open("./text.txt", "r+");

const { buffer, bytesRead } = await fileHandle.read({
  buffer: Buffer.alloc(10),
});

console.log({ bytesRead });
console.log({ buffer });

const { buffer: buf, bytesWritten } = await fileHandle.write(
  Buffer.from("hii")
);

console.log({ bytesWritten });
console.log({ buf });

await fileHandle.close();
