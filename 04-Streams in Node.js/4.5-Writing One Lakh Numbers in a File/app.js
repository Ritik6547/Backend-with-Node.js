import fs from "node:fs";

console.time();

// Time - 40 sec
// for (let i = 1; i <= 100000; i++) {
//   if (i === 1) {
//     fs.writeFileSync("nums.txt", i + " ");
//   } else {
//     fs.appendFileSync("nums.txt", i + " ");
//   }
// }
// console.timeEnd();

// Time - 450 ms
const writeStream = fs.createWriteStream("nums.txt");

for (let i = 1; i <= 100000; i++) {
  writeStream.write(i + " ");
}

writeStream.end();

writeStream.on("finish", () => {
  console.timeEnd();
});
