import sum, { num } from "./math.js";

const a = 5;

console.log(num);
console.log(sum(1, 2, 3, 4, 5));

// import.meta -> Object
import.meta.test = "alpha";
const { filename, dirname, test } = import.meta;
console.log(filename);
console.log(dirname);
console.log(test);
