import { ObjectId } from "mongodb";

export const addtodo = async (req, res) => {
  const db = req.db;
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const todo = {
    title,
    completed: completed ?? false,
  };

  try {
    await db.collection("todos").insertOne(todo);
    res.redirect("/todos");
  } catch (err) {
    return res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getAllTodos = async (req, res) => {
  const db = req.db;

  try {
    const allTodos = await db.collection("todos").find().toArray();

    res.render("index", { todos: allTodos });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodo = async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const todo = await db
      .collection("todos")
      .findOne({ _id: new ObjectId(id) });
    if (!todo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch todo" });
  }
};

export const updateTodo = async (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const updatedTodo = req.body;

  try {
    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Not updated" });
    }
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const result = await db
      .collection("todos")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo Not Found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
