const a = new ArrayBuffer(4);

const view = new DataView(a);

view.setInt16(0, 257);
view.setInt16(2, 260, true);

console.log(a);
console.log(view.getInt16(0));
console.log(view.getInt16(2, true));

const b = new ArrayBuffer(4);
const view2 = new DataView(b);

view2.setInt32(0, 0x5645a97c);

console.log(b);
console.log(view2.getInt32(0));
