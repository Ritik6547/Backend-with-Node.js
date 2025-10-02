export const num = 10;

const sum = (...nums) => nums.reduce((acc, curr) => acc + curr);

export default sum;
