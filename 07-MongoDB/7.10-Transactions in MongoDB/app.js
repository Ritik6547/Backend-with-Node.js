import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
await client.connect();
console.log("Database Connected");

const db = client.db();
const directories = db.collection("directories");
const users = db.collection("users");

const session = client.startSession();

try {
  session.startTransaction();

  await directories.insertOne({ name: "db", username: "alpha" }, { session });
  await users.insertOne({ name: "alpha", rootDirName: "db" }, { session });

  await session.commitTransaction();
} catch (err) {
  console.log(err);
  await session.abortTransaction();
} finally {
  await session.endSession();
}

await client.close();

console.log("Database Disconnected");
