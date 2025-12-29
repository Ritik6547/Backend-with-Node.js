import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost");

console.log("Database Connected");
