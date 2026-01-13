import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import courseRoutes from "./routes/courses.js";
import cartRoutes from "./routes/cart.js";
import authRoutes from "./routes/auth.js";
import { seedDatabase } from "./seed.js";
import cookieParser from "cookie-parser";

await connectDB();
await seedDatabase();

const app = express();
const PORT = 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser("secret123"));

// Routes
app.use("/courses", courseRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
