import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const db = client.db("todosApp");

const todosCollection = db.collection("todos");

// cursor - async iterator
const cursor = todosCollection.find();

while (await cursor.hasNext()) {
  console.log(await cursor.next());
}

// console.log(await cursor.toArray());

// console.log(await cursor.next());
// console.log(await cursor.next());
// console.log(await cursor.next());
// console.log(await cursor.hasNext());

// for await (const document of cursor) {
//   console.log(document);
// }

client.close();
