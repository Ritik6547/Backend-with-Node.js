import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { parseCookies } from "./middleware/parseCookies.js";

const app = express();

// Custom Cookie Parse Middleware
// app.use(parseCookies);

// Cookie Parser Library
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  // console.log(req.headers.cookie);
  console.log(req.cookies);

  // res.set({
  //   "Set-Cookie": [
  //     "name=alpha; HttpOnly; SameSite=None; Secure",
  //     "age=22; HttpOnly; SameSite=None; Secure",
  //     "email=test@gmail.com; HttpOnly; SameSite=None; Secure",
  //   ],
  // });

  res.cookie("name", "alpha", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });

  res.cookie("age", "22", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });

  res.cookie("email", "test@gmail.com", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });

  res.cookie("test", "abc=1234", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });
  res.json({ msg: "Hello World" });
});

app.listen(4000, () => {
  console.log("Server is running");
});
