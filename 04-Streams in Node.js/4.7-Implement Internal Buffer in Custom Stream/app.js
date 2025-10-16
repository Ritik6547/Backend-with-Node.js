import fs from "node:fs";

console.time();

const buff = Buffer.allocUnsafe(4);

const fd = fs.openSync("numbers.txt", "w");

let totalBytesWritten = 0;
for (let i = 1; i <= 10; i++) {
  const bytesWritten = buff.write(i + " ", totalBytesWritten);
  totalBytesWritten += bytesWritten;
  if (totalBytesWritten === buff.byteLength) {
    fs.writeSync(fd, buff);
    totalBytesWritten = 0;
  }
}

fs.closeSync(fd);

console.timeEnd();
