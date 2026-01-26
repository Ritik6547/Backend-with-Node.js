import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const { sid } = req.signedCookies;

  const session = await Session.findById(sid).populate("data.cart.courseId");
  if (!session) {
    return res.status(404).json({ error: "Not Found" });
  }

  if (!session.userId) {
    const cartCourses = session.data.cart.map((item) => {
      const { _id, name, price, image } = item.courseId;
      const quantity = item.quantity;

      return { id: _id, name, price, image, quantity };
    });

    return res.status(200).json(cartCourses);
  }

  const data = await Cart.findOne({ userId: session.userId }).populate(
    "courses.courseId",
  );

  const cartCourses = data.courses.map((item) => {
    const { _id, name, price, image } = item.courseId;
    const quantity = item.quantity;

    return { id: _id, name, price, image, quantity };
  });

  return res.status(200).json(cartCourses);
});

// Add to cart
router.post("/", async (req, res) => {
  const { courseId } = req.body;
  const { sid } = req.signedCookies;

  const session = await Session.findById(sid);
  if (session.userId) {
    const result = await Cart.updateOne(
      { userId: session.userId, "courses.courseId": courseId },
      { $inc: { "courses.$.quantity": 1 } },
    );

    if (result.matchedCount === 0) {
      await Cart.updateOne(
        { userId: session.userId },
        { $push: { courses: { courseId, quantity: 1 } } },
      );
    }

    return res.status(201).json({ message: "Course added to cart" });
  }

  const result = await Session.updateOne(
    { _id: sid, "data.cart.courseId": courseId },
    { $inc: { "data.cart.$.quantity": 1 } },
  );

  if (result.matchedCount === 0) {
    await Session.updateOne(
      { _id: sid },
      { $push: { "data.cart": { courseId, quantity: 1 } } },
    );
  }

  res.status(201).json({ message: "Course added to cart" });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  const { sid } = req.signedCookies;
  const { courseId } = req.params;

  const result = await Session.updateOne(
    { _id: sid },
    { $pull: { "data.cart": { courseId } } },
  );

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Course Not Found" });
  }

  res.status(200).json({ message: "Course deleted successfully" });
});

export default router;
