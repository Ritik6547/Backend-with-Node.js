import mongoose from "mongoose";

const url = "mongodb://alpha:alpha@localhost:27017/storageApp";

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
  console.log("Database Disconnected");
  process.exit(0);
});
