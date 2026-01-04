import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost:27017");
console.log("Database Connected");

const db = mongoose.connection.db;

const fruitsCollection = db.collection("fruits");

const res = await fruitsCollection.insertOne({ name: "apple" });
console.log(res);

await mongoose.disconnect();
