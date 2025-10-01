const { sum, product } = require("./math.js");

console.log(sum(1, 2, 3, 4, 5));
console.log(product(1, 2, 3, 4, 5));

const user = {
  name: "Ritik Kumar",
  age: 21,
  address: {
    city: "muz",
    state: "bihar",
  },
  hobbies: ["Reading", "Coding", "Music"],
};

let address = user.address;

// console.log(user.address === address);

// address.pinCode = 568737;
// address.country = "India";

address = {
  pinCode: 568737,
  country: "India",
};

// console.log(user.address);
