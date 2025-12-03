import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("school");

const studentsCollection = db.collection("students");
const teachersCollection = db.collection("teachers");

const result1 = await studentsCollection.insertOne({
  name: "alpha",
  class: "X",
  roll: 25,
});
const result2 = await teachersCollection.insertMany([
  { name: "master-1", subject: "Maths" },
  { name: "master-2", subject: "Physics" },
  { name: "master-3", subject: "Biology" },
]);

console.log(result1);
console.log(result2);

client.close();
