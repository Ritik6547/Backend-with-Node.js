import express from "express";

const app = express();
const port = 3000;

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  res.send("Data Recieved");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
