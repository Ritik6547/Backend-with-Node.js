import fsPromises from "node:fs/promises";
import fs from "node:fs";

setTimeout(() => {
  console.log("hii");
}, 0);

// ----------------- Async IO -------------------
const fileContent = await fsPromises.readFile("file.txt", "utf-8");
console.log(fileContent);

// fs.readFile("file.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

console.log("End");

// ------------------ Sync IO ---------------------
// const content = fs.readFileSync("file.txt", "utf-8");
// console.log(content);
