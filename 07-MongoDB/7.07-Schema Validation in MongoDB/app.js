import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const db = client.db();
const collection = db.collection("users");

// Add validation while creating a collection
await db.createCollection("fruits", {
  validator: {
    name: {
      $type: "string",
    },
    price: {
      $type: "int",
    },
  },
});

// Add validation while creating a collection using command
await db.command({
  create: "vegitables",
  validator: {
    name: {
      $type: "string",
    },
    category: {
      $in: ["abc", "def", "ghi"],
    },
  },
});

// Add validation in existing collection
await db.command({
  collMod: "users",
  validator: {
    name: {
      $type: "string",
    },
    age: {
      $type: "int",
      $gte: 18,
      $lte: 100,
    },
  },
});

const collections = await db.listCollections().toArray();
console.log(collections[0].options);

try {
  await collection.insertOne({ name: "rahul", age: 45 });
} catch (err) {
  console.log(err);
}

client.close();
