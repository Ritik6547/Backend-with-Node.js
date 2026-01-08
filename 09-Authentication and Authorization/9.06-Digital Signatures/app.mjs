import crypto from "node:crypto";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";

const fileBuffer = await readFile("./loan-agreement.md");

const secret_key = "secret123";

const signature = crypto
  .createHash("sha256")
  .update(fileBuffer)
  .update(secret_key)
  .digest("base64");

console.log(signature);

const writeStream = createWriteStream("signed-loan-agreement.md");

writeStream.write(fileBuffer);
writeStream.end(signature);
