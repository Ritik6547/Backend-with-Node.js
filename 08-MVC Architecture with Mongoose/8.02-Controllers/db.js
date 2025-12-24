import { MongoClient } from "mongodb";

const url = "mongodb://admin:admin@localhost:27017/todosApp?authSource=admin";
const client = new MongoClient(url);

export async function connectDB() {
  await client.connect();
  const db = client.db();
  console.log("Database Connected");
  return db;
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("Client Disconnected!");
  process.exit(0);
});
