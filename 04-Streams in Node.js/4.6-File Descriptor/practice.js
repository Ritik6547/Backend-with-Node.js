import fs from "node:fs";

const fd = fs.openSync("./numbers.txt", "w");

console.time();

for (let i = 1; i <= 100000; i++) {
  fs.writeSync(fd, i + " ");
}

console.timeEnd();
