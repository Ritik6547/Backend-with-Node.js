import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("school");

const teachersCollection = db.collection("teachers");

const result = await teachersCollection.updateOne(
  { _id: new ObjectId("693085dd685dde3f655178e5") },
  { $set: { age: 55 } }
);
console.log(result);

const res = await teachersCollection.replaceOne(
  { _id: new ObjectId("693085dd685dde3f655178e4") },
  { abc: "xyz" }
);
console.log(res);

client.close();
