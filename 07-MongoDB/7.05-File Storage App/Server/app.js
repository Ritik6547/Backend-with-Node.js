import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import checkAuth from "./middleware/auth.js";
import { connectDB } from "./config/db.js";

try {
  const db = await connectDB();

  const app = express();
  const port = 4000;

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use("/directory", checkAuth, directoryRoutes);
  app.use("/file", checkAuth, fileRoutes);
  app.use("/user", userRoutes);

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({ error: "Something went wrong" });
  });

  app.listen(port, () => console.log("Server started"));
} catch (err) {
  console.log("Not Connected to DB");
  console.log(err);
}
