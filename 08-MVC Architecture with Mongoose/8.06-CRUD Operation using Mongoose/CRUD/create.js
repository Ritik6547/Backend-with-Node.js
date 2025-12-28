import User from "../models/UserModel.js";

// const data = await User.insertOne({
//   name: "abc",
//   age: 22,
//   email: "abc@gmail.com",
//   hobbies: ["abcd"],
// });

// const data = await User.create({
//   name: "abc",
//   age: 22,
//   email: "abc@gmail.com",
//   hobbies: ["abcd"],
// });

// const data = await User.create([
//   {
//     name: "test",
//     age: 55,
//     email: "test@gmail.com",
//     hobbies: ["testing"],
//   },
//   {
//     name: "xyz",
//     age: 13,
//     email: "xyz@gmail.com",
//     hobbies: ["Cricket"],
//     parentId: "69518560e0c2378d87f3fff5",
//   },
// ]);

const user = new User({
  name: "alpha",
  age: 18,
  email: "alpha@gmail.com",
  hobbies: ["Coding"],
});

const data = await user.save();

console.log(data);
