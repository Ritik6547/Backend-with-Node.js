import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

await client.connect();

const admin = client.db().admin();
const allDbs = await admin.listDatabases();
console.log(allDbs);

const db = client.db("expenseApp");
console.log(db.databaseName);

const collectionsList = await db.listCollections().toArray();
console.log(collectionsList);

const collection = db.collection("users");
console.log(await collection.find().toArray());

client.close();
