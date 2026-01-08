import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

const signedFileContent = await readFile("signed-loan-agreement.md", "utf-8");

const [fileContent, hmac] = signedFileContent.split("हस्ताक्षर:-");

const secret_key = "secret123";

const newHmac = crypto
  .createHmac("sha256", secret_key)
  .update(fileContent + "हस्ताक्षर:-")
  .digest("base64url");

console.log(hmac);
console.log(newHmac);
