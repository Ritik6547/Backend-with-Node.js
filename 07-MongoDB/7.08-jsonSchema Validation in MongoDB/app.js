import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const db = client.db();

const collection = await db.createCollection("users", {
  validationAction: "error",
  validationLevel: "strict",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 20,
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 100,
        },
      },
      additionalProperties: false,
    },
  },
});

try {
  await collection.insertOne({ name: "rohan", age: 88 });
} catch (err) {
  console.log(err);
}

client.close();
