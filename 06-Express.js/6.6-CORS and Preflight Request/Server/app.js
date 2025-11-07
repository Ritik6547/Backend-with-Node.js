import express from "express";
import cors from "cors";

const app = express();

// app.use(cors());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  //   res.set("Access-Control-Allow-Methods", "PUT");

  next();
});

app.get("/api", (req, res) => {
  res.json({ mgs: "Hello from get" });
});

app.post("/api", (req, res) => {
  res.json({ mgs: "Hello from post" });
});

app.put("/api", (req, res) => {
  res.json({ mgs: "Hello from put" });
});

app.delete("/api", (req, res) => {
  res.json({ mgs: "Hello from delete" });
});

app.listen(3000, () => console.log("Server started"));
