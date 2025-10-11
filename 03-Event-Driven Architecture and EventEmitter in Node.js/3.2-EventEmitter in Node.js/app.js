import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.on("abc", () => {
  console.log("second abc event fired");
});

emitter.on("abc", () => {
  console.log("first abc event fired");
});

emitter.on("x", () => {
  console.log("first x fired");
});

emitter.on("x", () => {
  console.log("second x fired");
});

emitter.on("y", () => {
  console.log("y fired");
});

emitter.once("z", () => {
  console.log("z fired");
});

emitter.emit("abc");
emitter.emit("y");
emitter.emit("x");

emitter.emit("z");
emitter.emit("z");
emitter.emit("z");
