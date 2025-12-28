import User from "../models/UserModel.js";

const user = await User.findOne({ name: "alpha" }).lean();

// const user = await User.find().lean();

console.log(user);
