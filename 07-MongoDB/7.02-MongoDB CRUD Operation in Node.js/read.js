import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("todosApp");

console.log(await db.listCollections().toArray());

const todosCollection = db.collection("todos");
const todosData = await todosCollection.find({ completed: true }).toArray();
console.log(todosData);

client.close();
