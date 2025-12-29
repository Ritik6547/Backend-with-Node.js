import mongoose from "mongoose";

const url = "mongodb://admin:admin@localhost:27017/todosApp?authSource=admin";

export async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("Database Connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Client Disconnected!");
  process.exit(0);
});
