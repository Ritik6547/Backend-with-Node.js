import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

const user = new User({
  name: "test",
  age: 50,
  email: "test@gmail.com",
});

await user.save();

await mongoose.disconnect();
console.log("Database Disconnected");
