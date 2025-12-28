import User from "../models/UserModel.js";

// const user = await User.findOne({ name: "alpha" });
// user.age = 19;
// const data = await user.save();
// console.log(data);

const user = await User.findOneAndUpdate(
  { name: "test" },
  { age: 85 },
  { new: true, runValidators: true }
);
console.log(user);
