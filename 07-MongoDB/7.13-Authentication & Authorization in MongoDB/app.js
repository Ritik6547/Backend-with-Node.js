import { MongoClient } from "mongodb";

const connectionUrl = "mongodb://alpha:alpha@127.0.0.1:27018/example";
// const connectionUrl =
//   "mongodb://ram:ram@127.0.0.1:27018/storageApp?authSource=admin";

const client = new MongoClient(connectionUrl);

await client.connect();

const db = client.db();
const collection = db.collection("customers");
const data = await collection.find().toArray();

console.log(data);
client.close();
