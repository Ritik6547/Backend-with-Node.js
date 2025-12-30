import mongoose from "mongoose";

const url = "mongodb://alpha:alpha@localhost:27017/storageApp?authSource=admin";

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
  console.log("Client Disconnected");
  process.exit(0);
});
