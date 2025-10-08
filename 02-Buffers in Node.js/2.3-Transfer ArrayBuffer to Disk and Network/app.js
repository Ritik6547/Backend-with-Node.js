import fs from "node:fs/promises";

const uint8ArrayView = new Uint8Array(11);

uint8ArrayView[0] = 0x52;
uint8ArrayView[1] = 0x69;
uint8ArrayView[2] = 0x74;
uint8ArrayView[3] = 0x69;
uint8ArrayView[4] = 0x6b;
uint8ArrayView[5] = 0x20;
uint8ArrayView[6] = 0x4b;
uint8ArrayView[7] = 0x75;
uint8ArrayView[8] = 0x6d;
uint8ArrayView[9] = 0x61;
uint8ArrayView[10] = 0x72;

// const decoder = new TextDecoder("utf-8");
// const res = decoder.decode(uint8ArrayView);
// console.log(res);

fs.writeFile("name.txt", uint8ArrayView);
