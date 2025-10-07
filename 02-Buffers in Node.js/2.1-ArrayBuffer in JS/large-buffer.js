const a = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);

const view = new DataView(a);

for (let i = 0; i < a.byteLength; i++) {
  view.setInt8(i, i + 1);
}

console.log("End");
