import { prisma } from "../../db/database.js";

export const getHabits = (userId, weekStart) => {
  return prisma.habit.findMany({
    where: {
      userId,
      ...(weekStart ? { weekStart: new Date(weekStart) } : {}),
    },
    orderBy: { id: "asc" },
  });
};

export const createHabitRepo = async (title, weekStart, userId) => {
  return await prisma.habit.create({
    data: {
      title,
      weekStart,
      userId,
      done: false, 
    },
  });
};

export const findHabitById = (id) =>
  prisma.habit.findUnique({
    where: { id },
  });

export const updateHabitTitleRepo = (id, title) =>
  prisma.habit.update({
    where: { id },
    data: { title },
  });

export const updateHabitStatusRepo = (id, done) => {
  return prisma.habit.update({
    where: { id },
    data: { done },
  });
};

export const deleteHabitRepo = (id) => 
  prisma.habit.delete({ where: { id } });