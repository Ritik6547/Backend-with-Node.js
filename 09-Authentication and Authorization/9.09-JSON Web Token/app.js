import jwt from "jsonwebtoken";
import { createHmac } from "node:crypto";

const token = jwt.sign({ name: "test" }, "secret123", {
  algorithm: "HS256",
  expiresIn: 10,
});
console.log(token);

console.log(jwt.decode(token));

setTimeout(() => {
  console.log(jwt.verify(token, "secret123"));
}, 10000);

/*
const payload = jwt.verify(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlhdCI6MTc2ODA3MDMxM30.ptNne2g459hhMdz80YiVY6Xkow20uOL6HR6FcZ1zL_8",
  "secret123"
);
console.log(payload);
*/

/*
const t =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlhdCI6MTc2ODA3MDMxM30.ptNne2g459hhMdz80YiVY6Xkow20uOL6HR6FcZ1zL_8";

const hmac = createHmac("sha256", "secret123")
  .update(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlhdCI6MTc2ODA3MDMxM30"
  )
  .digest("base64url");

console.log(hmac);
*/
