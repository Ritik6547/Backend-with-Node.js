import { Buffer } from "buffer";

const buf = Buffer.from("Hello World", "utf-8");
const buf2 = Buffer.alloc(12);
const buf3 = Buffer.allocUnsafe(8);
const buf4 = Buffer.alloc(10);

// console.log(buf.toString("utf-8"));

// buf2.write("abc", "utf-8");
console.log(buf2.toString("utf-8"));
console.log(buf2.toJSON());

console.log(buf.subarray(2).toString());

buf.copy(buf2, 0, 0, 5);
console.log(buf2.toString());

console.log(buf.includes("lo"));

buf3.fill(97);
console.log(buf3.toString());

console.log(buf);
console.log(buf.readInt8(2));
console.log(buf.readInt16LE(0));
console.log(buf.readInt16BE(0));
console.log(buf.readInt32LE(0));
console.log(buf.readInt32BE(0));

// buf4.writeInt8(97, 1);
// buf4.writeInt16LE(97);
buf4.writeInt16BE(97);
console.log(buf4);

// Properties
console.log(buf.buffer);
console.log(buf.byteLength);
console.log(buf.byteOffset);
console.log(buf.length);
