import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const { sid } = req.signedCookies;

  const session = await Session.findById(sid);
  if (!session) {
    return res.status(404).json({ error: "Not Found" });
  }

  const courseIds = session.data.cart.map((item) => item.courseId);

  const courses = await Course.find({ _id: { $in: courseIds } })
    .select("_id name price image")
    .lean();

  const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

  const cartCourses = session.data.cart
    .map((item) => {
      const course = courseMap.get(item.courseId.toString());
      if (!course) return null;

      return { ...course, quantity: item.quantity };
    })
    .filter(Boolean);

  res.status(200).json(cartCourses);
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
  const { sid } = req.signedCookies;
  const { courseId } = req.params;

  const result = await Session.updateOne(
    { _id: sid },
    { $pull: { "data.cart": { courseId } } }
  );

  res.status(200).json({ message: "Course deleted successfully" });
});

export default router;
