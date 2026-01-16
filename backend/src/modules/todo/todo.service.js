import {
  findTodos,
  insertTodo,
  findTodoById,
  updateTodo,
  deleteTodo,
} from "./todo.repository.js";

export const getAllTodos = async (userId) => {
  return await findTodos(userId);
};

export const createTodo = async (text, deadline, userId) => {
  if (!text || !deadline) {
    throw new Error("Text dan deadline wajib diisi.");
  }

  const date = new Date(deadline);
  if (isNaN(date)) throw new Error("Format deadline tidak valid.");

  return await insertTodo(text, date, userId);
};

export const toggleTodo = async (todoId, userId) => {
  const todo = await findTodoById(todoId, userId);
  if (!todo) throw new Error("Todo tidak ditemukan.");

  return await updateTodo(todoId, {
    completed: !todo.completed,
  });
};

export const removeTodo = async (todoId, userId) => {
  const todo = await findTodoById(todoId, userId);
  if (!todo) throw new Error("Todo tidak ditemukan.");

  await deleteTodo(todoId);

  return { message: "Todo berhasil dihapus." };
};
