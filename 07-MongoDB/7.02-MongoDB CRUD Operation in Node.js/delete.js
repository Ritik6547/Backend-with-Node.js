import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("school2");

// Delete a collection
// const studentsCollection = db.collection("students");
// await studentsCollection.drop();

// Delete a document
// const teachersCollection = db.collection("teachers");
// const result = await teachersCollection.deleteOne({
//   _id: new ObjectId("69308581cc8fd68a950f18a5"),
// });
// console.log(result);

// Delete a database
const isDatabaseDeleted = await db.dropDatabase();
console.log(isDatabaseDeleted);

client.close();
