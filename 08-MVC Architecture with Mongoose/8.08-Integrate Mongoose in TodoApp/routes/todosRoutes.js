import express from "express";
import { ObjectId } from "mongodb";
import {
  addtodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!ObjectId.isValid(id) || String(new ObjectId(id)) != id) {
    return res.status(400).json({ msg: "Invalid Id" });
  }
  next();
});

router.route("/").get(getAllTodos).post(addtodo);
router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

export default router;
