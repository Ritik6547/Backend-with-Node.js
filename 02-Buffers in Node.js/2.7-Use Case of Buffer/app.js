import fs from "node:fs/promises";

const a = await fs.readFile("./file.txt");
const res = await fs.readFile("C:\\Users\\ALPHA\\Desktop\\node.png");

console.log(a);
console.log(res);
