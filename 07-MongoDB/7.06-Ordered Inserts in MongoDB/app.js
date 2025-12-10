import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const db = client.db();
const collection = db.collection("users");

const result = await collection.insertMany(
  [
    { name: "test-5" },
    { _id: new ObjectId("6939dc1c0e346828cf4da1ed"), name: "test-2" },
    { name: "test-3" },
    { name: "test-4" },
  ],
  { ordered: true }
);

console.log(result);

// Ordered Inserts --> Stop insertion on first error
// Unordered Inserts --> Continues inserting even after errors

client.close();
