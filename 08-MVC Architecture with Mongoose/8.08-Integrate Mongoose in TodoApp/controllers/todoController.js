import Todo from "../models/todoModel.js";

export const addtodo = async (req, res) => {
  const todo = req.body;

  if (!todo.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    await Todo.create(todo);
    res.redirect("/todos");
  } catch (err) {
    return res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const allTodos = await Todo.find();

    res.render("index", { todos: allTodos });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch todo" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;

  try {
    const result = await Todo.findByIdAndUpdate(id, updatedTodo);
    if (!result) {
      return res.status(404).json({ error: "Not updated" });
    }
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Todo.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Todo Not Found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
