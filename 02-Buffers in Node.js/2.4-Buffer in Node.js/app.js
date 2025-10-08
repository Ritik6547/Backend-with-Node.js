import { Buffer } from "buffer";

const arrBuffer = new ArrayBuffer(4);

const buff = Buffer.alloc(4);
const buff1 = Buffer.from(arrBuffer);

const uint8Array = new Uint8Array(arrBuffer);
uint8Array[0] = 0x61;
uint8Array[1] = 0x62;
uint8Array[2] = 0x63;
uint8Array[3] = 0x64;

const buff2 = Buffer.from([97, 98, 99, 100]);

console.log(buff2);
console.log(buff2.buffer);

const buff3 = Buffer.allocUnsafe(4);
console.log(buff3);
console.log(buff3.buffer);
