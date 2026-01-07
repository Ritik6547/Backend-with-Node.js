import crypto from "node:crypto";
import fs from "node:fs/promises";

const hash = crypto.createHash("sha256").update("Hello World").digest("hex");
console.log(hash);

const vscodeBuffer = await fs.readFile(
  "C:\\Users\\ALPHA\\Downloads\\VSCodeUserSetup-x64-1.107.1.exe"
);

const vscodeChecksum = crypto
  .createHash("sha256")
  .update(vscodeBuffer)
  .digest("hex");
console.log(vscodeChecksum);
