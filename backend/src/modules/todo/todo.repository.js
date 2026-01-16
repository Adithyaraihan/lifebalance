import { prisma } from "../../db/database.js";

// Ambil semua todo untuk user tertentu
export const findTodos = async (userId) => {
  return await prisma.todo.findMany({
    where: { userId },
    orderBy: { deadline: "asc" },
  });
};

// Tambah todo
export const insertTodo = async (text, deadline, userId) => {
  return await prisma.todo.create({
    data: {
      text,
      deadline,
      userId,
      completed: false,
    },
  });
};

// Cari todo by id & user
export const findTodoById = async (id, userId) => {
  return await prisma.todo.findFirst({
    where: { id, userId },
  });
};

// Update todo
export const updateTodo = async (id, data) => {
  return await prisma.todo.update({
    where: { id },
    data,
  });
};

// Delete todo
export const deleteTodo = async (id) => {
  return await prisma.todo.delete({
    where: { id },
  });
};
