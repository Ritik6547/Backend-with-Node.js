import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

try {
  const user = await User.insertOne({
    name: "xyz",
    email: "xyz@gmail.com",
  });
  console.log(user);
} catch (err) {
  console.log(err);
}

await mongoose.disconnect();
console.log("Database Disconnected");
