#! /usr/bin/env node
import fs from "node:fs/promises";

// Synchronous
// const content = fs.readFileSync("./index.html", "utf-8");

// Asynchronous
// fs.readFile("./index.html", (err, data) => {
//   const content = data.toString();
//   console.log(content);
// });

const content = await fs.readFile("./index.html", "utf-8");
console.log(content);
console.log("End");

fs.writeFile("./file-1.txt", "Hello World");
fs.appendFile("file-1.txt", "\nAlpha");

const fileContent = await fs.readFile("./file-1.txt", "utf-8");
fs.writeFile("C:\\Users\\ALPHA\\Desktop\\hello.txt", fileContent);

try {
  const nodePngBuffer = await fs.readFile("./node.png");
  fs.writeFile("C:\\Users\\ALPHA\\Desktop\\node.png", nodePngBuffer);
} catch (err) {
  fs.appendFile(
    "./error.log",
    `${new Date().toLocaleTimeString()}\n${err.message}\n${err.stack}\n\n`
  );
}

// setInterval(() => {
//   fs.writeFile("./time.txt", new Date().toLocaleTimeString());
// }, 1000);
