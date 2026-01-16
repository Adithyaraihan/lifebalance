import { prisma } from "../../db/database.js";

export const findData = async (take, userId) => {
  return await prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    take: take,
  });
};

export const insertData = async (weightKg, heightCm, userId) => {
  return await prisma.bodyMetric.create({
    data: {
      userId,
      weightKg,
      heightCm,
    },
  });
};

export const findLatestData = async (userId) => {
  return await prisma.bodyMetric.findFirst({
    where: { userId },
    select: { heightCm: true, weightKg: true },
    orderBy: { id: "desc" },
  });
};
