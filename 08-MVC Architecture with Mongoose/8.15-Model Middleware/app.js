import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

const res = await User.insertMany([
  { name: "abc", age: 20, email: "abc@gmail.com" },
  { name: "xyz", age: 26, email: "xyz@gmail.com" },
]);

console.log(res);

await mongoose.disconnect();
console.log("Database Disconnected");
