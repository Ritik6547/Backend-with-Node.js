// const arrBuffer = new ArrayBuffer(4);

// const uint8Array = new Uint8Array(arrBuffer);
// const uint16Array = new Uint16Array(arrBuffer);
// const uint32Array = new Uint32Array(arrBuffer);

// const uint8Array = new Uint8Array(4);
// uint8Array[0] = 0xf3;
// uint8Array[1] = 0x6d;
// uint8Array[2] = 0x7b;
// uint8Array[3] = 0xee;

const uint8Array = new Uint8Array([0xf3, 0x6d, 0x7b, 0xee]);

console.log(uint8Array.buffer);

const uint8Array2 = new Uint8Array(1.99 * 1024 * 1024 * 1024).fill(0xff);
// for (let i = 0; i < uint8Array2.byteLength; i++) {
//   uint8Array2[i] = i + 1;
// }
console.log(uint8Array2.buffer);
