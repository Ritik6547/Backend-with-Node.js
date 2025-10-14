import fs from "node:fs";

const writeStream = fs.createWriteStream("terminal.txt");

process.stdin.pipe(writeStream);

process.stdout.write("Hii");
process.stderr.write("Error");

console.log(process.stdin.fd);
console.log(process.stdout.fd);
console.log(process.stderr.fd);
