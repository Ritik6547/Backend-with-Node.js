import express from "express";
import multer from "multer";
import path from "node:path";
import cors from "cors";

const app = express();
const port = 4000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const id = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    const filename = `${id}${extension}`;
    file.id = id;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.post("/upload", upload.single("profile"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  res.json({ msg: "Data Received" });
});

app.listen(port, () => {
  console.log("Server is running");
});
