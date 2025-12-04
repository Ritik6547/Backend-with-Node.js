import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/storageApp";
const client = new MongoClient(url);

export async function connectDB() {
  await client.connect();
  console.log("Database Connected");

  const db = client.db();
  return db;
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("Client Disconnected");
  process.exit(0);
});
