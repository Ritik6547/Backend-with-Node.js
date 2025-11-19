import express from "express";

const app = express();

app.use(express.static("public"));

app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
// Custom json body parser
app.use((req, res, next) => {
  if (req.header("content-type") === "application/json") {
    let data;
    req.on("data", (chunk) => {
      data = chunk.toString();
    });

    req.on("end", () => {
      req.body = JSON.parse(data);
      next();
    });
  } else {
    req.body = {};
    next();
  }
});
*/

app.post("/user", (req, res) => {
  console.log(req.header("content-type"));

  console.log(req.body);

  res.json({ msg: "Data Received" });
});

app.listen(4000, () => {
  console.log("Server is running");
});
