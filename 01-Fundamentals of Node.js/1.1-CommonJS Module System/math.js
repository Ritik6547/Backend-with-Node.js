function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr, 1);
}

// module.exports.sum = sum;
// module.exports.product = product;

module.exports = { sum, product };
