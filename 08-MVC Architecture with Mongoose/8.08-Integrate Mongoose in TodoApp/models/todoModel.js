import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: "throw",
  }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
