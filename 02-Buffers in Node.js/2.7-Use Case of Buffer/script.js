const a = new ArrayBuffer(4);
const uint8Arr = new Uint8Array(a);
uint8Arr[0] = 97;
uint8Arr[1] = 98;
uint8Arr[2] = 99;
uint8Arr[3] = 100;

fetch("http://localhost:3000", {
  method: "POST",
  body: uint8Arr,
})
  .then((res) => res.text())
  .then((data) => console.log(data));
