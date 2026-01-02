import mongoose from "mongoose";
import "./db.js";
import User from "./UserModel.js";

const user = await User.findOne({ email: "ritik@gmail.com" });

console.log(user.isAdult);
console.log(user.hobbiesString);
console.log(user.emailDomain);

// user.hobbiesString = "TT, Football";
// console.log(user.hobbiesString);

console.log(user.getSummary());

// await user.save();

// console.log(user.schema.virtuals);
// console.log(user.toJSON({ virtuals: true }));

// console.log(user.toObject());

await mongoose.disconnect();
console.log("Database Disconnected");
