import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use("/directory", directoryRoutes);
app.use("/file", fileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ msg: "Something went wrong" });
});

app.listen(port, () => console.log("Server started"));
