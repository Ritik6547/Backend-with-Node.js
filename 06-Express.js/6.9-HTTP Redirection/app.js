import express from "express";

const app = express();

app.get("/directory", (req, res) => {
  //   res.set({
  //     Location: "/folder",
  //   });
  //   res.status(301).end();

  res.redirect(301, "/folder");
});

app.get("/folder", (req, res) => {
  res.json({
    name: "images",
    files: ["node.png", "test.jpg"],
  });
});

app.listen(4000, () => {
  console.log("Server is running");
});
