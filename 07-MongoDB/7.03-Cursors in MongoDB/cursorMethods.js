import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("expenseApp");

const todosCollection = db.collection("expenses");

// cursor - async iterator
const cursor = todosCollection
  .find()
  .filter({ category: "Food" })
  .skip(0)
  .limit(0)
  .sort({ amount: 1 });

const data = await cursor.toArray();
console.log(data.map(({ title, amount }) => ({ title, amount })));

client.close();
