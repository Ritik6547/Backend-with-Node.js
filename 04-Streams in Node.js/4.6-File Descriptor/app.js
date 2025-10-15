import fs from "node:fs";

console.log(process.stdin.fd);
console.log(process.stdout.fd);
console.log(process.stderr.fd);

const fd1 = fs.openSync("text.txt");

const fd2 = fs.openSync("./num.txt");

const fd3 = fs.openSync("./package.json");

console.log(fd1);
console.log(fd2);
console.log(fd3);
