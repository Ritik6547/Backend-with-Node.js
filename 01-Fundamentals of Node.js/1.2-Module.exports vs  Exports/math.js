function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr, 1);
}

// let exports = module.exports;
exports.sum = sum;
exports.product = product;

// console.log(module.exports);
// console.log(module.exports === exports);

// module.exports.sum = sum;
// module.exports.product = product;

// module.exports = { sum, product };
