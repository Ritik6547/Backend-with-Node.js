import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

const users = await User.find({ name: "test" });

console.log(users);

await mongoose.disconnect();
console.log("Database Disconnected");
