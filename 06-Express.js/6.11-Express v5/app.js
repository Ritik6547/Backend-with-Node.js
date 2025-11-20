import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get("/{:id}", async (req, res) => {
  const { id } = req.params;

  console.log(req.body);

  res.json({
    package: "Express",
    Version: 5,
    params: id || "root",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ msg: err.message, version: 5 });
});

const server = app.listen(4000, "0.0.0.0", (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on ${JSON.stringify(server.address())}`);
});
