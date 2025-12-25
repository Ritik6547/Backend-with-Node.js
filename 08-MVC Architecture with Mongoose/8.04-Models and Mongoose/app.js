import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost");
console.log("Database Connected");

// mongoose.pluralize((word) => word.toLowerCase());

mongoose.set("autoCreate", false);

const UserModel = mongoose.model("User", { name: String, age: Number });

const result = await UserModel.insertOne({ name: "ritik", age: 22 });
console.log(result);
