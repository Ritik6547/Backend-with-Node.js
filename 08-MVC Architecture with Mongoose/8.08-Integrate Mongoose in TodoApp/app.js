import express from "express";
import todosRoutes from "./routes/todosRoutes.js";
import { connectDB } from "./db.js";
import { createEngine } from "express-react-views";

try {
  await connectDB();

  const app = express();
  const PORT = 4000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static("./public"));

  app.set("views", "./views");
  app.set("view engine", "jsx");
  app.engine("jsx", createEngine());

  app.use("/todos", todosRoutes);

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.log(err);
    return res
      .status(err.status || 500)
      .json({ error: "Something went wrong" });
  });

  const server = app.listen(PORT, () => {
    console.log(server.address());
    console.log("Server is running");
  });
} catch (err) {
  console.log(err);
  console.log("Database not connected");
}
