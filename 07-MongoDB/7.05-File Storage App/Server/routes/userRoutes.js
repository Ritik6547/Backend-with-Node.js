import express from "express";
import checkAuth from "../middleware/auth.js";
import { ObjectId } from "mongodb";
import { client } from "../config/db.js";

const router = express.Router();

// User registration
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  const db = req.db;

  const dirCollection = db.collection("directories");
  const usersCollection = db.collection("users");

  const session = client.startSession();

  try {
    session.startTransaction();

    const user = await usersCollection.findOne({ email }, { session });
    if (user) {
      await session.abortTransaction();
      return res.status(409).json({
        error: "User already exits",
        msg: "A user with this email address already exists.",
      });
    }

    const rootDirId = new ObjectId();
    const userId = new ObjectId();

    await dirCollection.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session }
    );

    await usersCollection.insertOne(
      {
        _id: userId,
        name,
        email,
        password,
        rootDirId,
      },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    await session.abortTransaction();
    if (err.code === 121) {
      return res.status(400).json({ error: "Invalid Field Data" });
    } else {
      next(err);
    }
  } finally {
    await session.endSession();
  }
});

// User login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const db = req.db;

  const user = await db.collection("users").findOne({ email, password });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  res.cookie("uid", user._id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });

  res.json({ msg: "Logged In" });
});

// Get user details
router.get("/", checkAuth, (req, res) => {
  const { name, email } = req.user;

  res.status(200).json({ name, email });
});

// User logout
router.post("/logout", (req, res) => {
  // res.cookie("uid", "", {
  //   maxAge: 0,
  // });
  res.clearCookie("uid");

  res.status(200).json({ msg: "Logged Out" });
});

export default router;
