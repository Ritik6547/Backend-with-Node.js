import { MongoClient } from "mongodb";
import { title } from "process";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("expenseApp");

const todosCollection = db.collection("expenses");

const cursor = todosCollection.find(
  {},
  { projection: { title: 1, amount: 1, _id: 0 } }
);

const data = await cursor.toArray();
console.log(data);

client.close();
