import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

const user1 = await User.findOne({ email: "alpha@gmail.com" });
const user2 = await User.findOne({ email: "alpha@gmail.com" });

console.log(user1.__v);
user1.balance += 500;
await user1.save();
console.log(user1.__v);

console.log(user2.__v);
user2.balance += 200;
await user2.save();
console.log(user2.__v);

await mongoose.disconnect();
console.log("Database Disconnected");
