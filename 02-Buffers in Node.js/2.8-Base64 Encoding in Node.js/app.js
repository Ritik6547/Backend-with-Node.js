import fs from "node:fs/promises";

const buf = await fs.readFile("./favicon-16x16.png");
const res = buf.toString("base64");

await fs.writeFile("emoji.txt", res);

const dataBuffer = await fs.readFile("./emoji.txt");
const data = dataBuffer.toString("utf-8");

fs.writeFile("emoji.png", data, "base64");
