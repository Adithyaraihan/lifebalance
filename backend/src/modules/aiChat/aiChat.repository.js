import { prisma } from "../../db/database.js";

export const getChats = (userId) => {
  return prisma.aIChat.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });
};

export const saveChat = (question, answer, userId) => {
  return prisma.aIChat.create({
    data: { question, answer, userId },
  });
};

export const deleteChats = (userId) => {
  return prisma.aIChat.deleteMany({
    where: { userId },
  });
};
