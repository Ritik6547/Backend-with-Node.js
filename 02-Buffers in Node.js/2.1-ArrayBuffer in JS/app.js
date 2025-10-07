const arrBuffer = new ArrayBuffer(4);

const view = new DataView(arrBuffer);

view.setInt8(0, 80);
view.setInt8(1, 0b01010000);
view.setInt8(2, 0x50);
view.setInt8(3, 0o120);

view.setInt8(0, 0xff);
view.setInt8(1, 127);
view.setInt8(2, 128);

console.log(arrBuffer);

// Signed Value
console.log(view.getInt8(0));
console.log(view.getInt8(1));
console.log(view.getInt8(2));

// UnSigned Value
console.log(view.getUint8(0));
console.log(view.getUint8(1));
console.log(view.getUint8(2));
