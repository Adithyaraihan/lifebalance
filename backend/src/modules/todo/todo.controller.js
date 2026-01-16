import {
  getAllTodos,
  createTodo,
  toggleTodo,
  removeTodo,
} from "./todo.service.js";

export const getTodosController = async (req, res) => {
  try {
    const todos = await getAllTodos(req.user.userId);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTodoController = async (req, res) => {
  try {
    const { text, deadline } = req.body;
    const todo = await createTodo(text, deadline, req.user.userId);

    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const toggleTodoController = async (req, res) => {
  try {
    const todoId = Number(req.params.id);
    const todo = await toggleTodo(todoId, req.user.userId);

    res.json(todo);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteTodoController = async (req, res) => {
  try {
    const todoId = Number(req.params.id);
    const result = await removeTodo(todoId, req.user.userId);

    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
