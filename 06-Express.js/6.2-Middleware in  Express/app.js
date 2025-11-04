import express from "express";

const app = express();
const port = 3000;

app.get(
  "/",
  (req, res, next) => {
    // Request Handler Middleware - 3 params
    console.log("Running Middleware 1");
    next();
    res.end("Hello World 1 ");
  },
  (req, res) => {
    // Request Handler Middleware - 2 params
    console.log("Running Middleware 2");
    res.write("Hello World 2 ");
  },
  (err, req, res, next) => {
    // Error Handler Middleware - 4 params
    console.log({ err });
    console.log("Running Error Middleware");
    res.end("Error Found");
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
