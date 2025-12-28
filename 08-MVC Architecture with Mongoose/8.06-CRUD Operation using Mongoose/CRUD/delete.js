import User from "../models/UserModel.js";

const user = await User.findOneAndDelete({ name: "abc" });

console.log(user);
