import MyEventEmitter from "./customEventEmitter.js";

const em = new MyEventEmitter();

em.on("greet", (name, age) => {
  console.log(`Hello ${name}!, You are ${age} years old.`);
});

em.on("test", () => {
  console.log("This is test 2");
});

em.on("test", () => {
  console.log("This is test 1");
});

em.on("sum", (...nums) => {
  let sum = 0;
  nums.forEach((num) => (sum += num));
  console.log("Sum = ", sum);
});

em.emit("greet", "alpha", 22);
em.emit("test");
em.emit("sum", 1, 2, 3, 4, 5);
