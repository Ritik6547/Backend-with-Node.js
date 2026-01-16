import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  //Add your code here
});

// Add to cart
router.post("/", async (req, res) => {
  const { courseId } = req.body;
  const { sid } = req.signedCookies;

  const result = await Session.updateOne(
    { _id: sid, "data.cart.courseId": courseId },
    { $inc: { "data.cart.$.quantity": 1 } }
  );

  if (result.matchedCount === 0) {
    await Session.updateOne(
      { _id: sid },
      { $push: { "data.cart": { courseId, quantity: 1 } } }
    );
  }

  res.status(201).json({ message: "Course added to cart" });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  //Add your code here
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
