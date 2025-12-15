import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const db = client.db();

const collection = db.collection("users");
const collectionInfo = await db.listCollections({ name: "users" }).toArray();
const schema = collectionInfo[0].options.validator.$jsonSchema;

const invalidDocuments = await collection
  .find({
    $nor: [
      {
        $jsonSchema: schema,
      },
    ],
  })
  .toArray();

console.log(invalidDocuments);

client.close();
