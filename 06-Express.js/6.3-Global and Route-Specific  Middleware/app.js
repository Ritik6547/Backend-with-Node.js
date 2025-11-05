import express from "express";

const app = express();
const port = 3000;

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function parseRequestBody(req, res, next) {
  req.on("data", (chunk) => {
    const reqBody = JSON.parse(chunk.toString());
    req.body = reqBody;
  });
  req.on("end", () => {
    next();
  });
}

app.use(logger);
app.use(express.json());

app.use("/admin", (req, res, next) => {
  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Not Authorized");
  }
});

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.post("/admin", (req, res) => {
  console.log(req.body);
  res.end("Hello Admin");
});

app.get("/login", (req, res) => {
  res.end("Logged In");
});

app.get("/user", (req, res) => {
  res.end("alpha");
});

app.post("/user", (req, res) => {
  console.log(req.body);
  res.send("user credentials received");
});

app.listen(port, () => console.log("Server started"));
