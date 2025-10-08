import { Buffer, constants } from "buffer";

Buffer.poolSize = 10000;

console.log(constants.MAX_LENGTH);
// console.log(constants.MAX_STRING_LENGTH);

const a = Buffer.alloc(4);
const b = Buffer.allocUnsafe(4095);
const c = Buffer.allocUnsafe(4095);
const d = Buffer.from("abc");
const e = Buffer.allocUnsafe(4);
const f = Buffer.allocUnsafeSlow(4);

a[0] = 0x61;
a[1] = 0x62;

b[0] = 0x61;
b[1] = 0x62;

c[0] = 0x63;
c[1] = 0x64;

console.log(a);
console.log(a.buffer);

console.log("-----------------------------------------");

console.log(b);
console.log(b.buffer);

console.log(e);
console.log(e.buffer);
console.log(f);
console.log(f.buffer);
