import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log({ email, password, name });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { sid } = req.signedCookies;
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const session = await Session.findById(sid);

    if (!session) {
      const newSession = await Session.create({ userId: user._id });
      res.cookie("sid", newSession.id, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    } else {
      session.expires = Math.round(Date.now() / 1000) + 60 * 60 * 24 * 7;
      session.userId = user._id;

      const userCart = await Cart.findOne({ userId: user._id });

      if (!userCart) {
        const result = await Cart.create({
          userId: user._id,
          courses: session.data.cart,
        });
      } else {
        userCart.courses.push(...session.data.cart);
        await userCart.save();
      }

      session.data = {};

      await session.save();

      res.cookie("sid", session.id, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);

  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/profile", async (req, res) => {
  const { sid } = req.signedCookies;

  const session = await Session.findById(sid);
  if (!session) {
    res.clearCookie("sid");
    return res.status(404).json({ message: "Not Logged In" });
  }

  if (!session.userId) {
    return res.status(404).json({ message: "Not Logged In" });
  }

  if (session.expires < Math.round(Date.now() / 1000)) {
    await session.deleteOne();
    return res.status(404).json({ message: "Not Logged In" });
  }

  const user = await User.findById(session.userId).lean();

  res.status(200).json({ name: user.name, email: user.email });
});

export default router;
