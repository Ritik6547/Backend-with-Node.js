import crypto from "node:crypto";

const password = "myPassword";
const salt = crypto.randomBytes(16);
const iterations = 100000;
const keyLength = 32;
const digest = "sha256";

crypto.pbkdf2(
  password,
  salt,
  iterations,
  keyLength,
  digest,
  (err, derivedKey) => {
    if (err) throw err;

    console.log(derivedKey.toString("hex"));
  }
);
