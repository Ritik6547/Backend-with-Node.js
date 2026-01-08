import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

const signedFileContent = await readFile("signed-loan-agreement.md", "utf-8");

const [fileContent, signature] = signedFileContent.split("हस्ताक्षर:-");

const secret_key = "secret123";

const newSignature = crypto
  .createHash("sha256")
  .update(fileContent + "हस्ताक्षर:-")
  .update(secret_key)
  .digest("base64");

console.log(signature);
console.log(newSignature);
