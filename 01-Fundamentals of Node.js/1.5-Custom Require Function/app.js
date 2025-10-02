const { num } = myRequire("./math.js");
const { sum } = myRequire("./sum.js");

console.log(num);
console.log(sum(1, 2, 3, 4, 5));

function myRequire(path) {
  const fs = require("fs");
  const content = fs.readFileSync(path).toString();
  return (function (send) {
    eval(content);
    return send;
  })({});
}
