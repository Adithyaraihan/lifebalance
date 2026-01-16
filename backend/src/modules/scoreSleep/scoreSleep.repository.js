import { prisma } from "../../db/database.js";

export const findDataSleep = async (userId, take = 7) => {
  return await prisma.sleep.findMany({
    where: {
      userId,
    },
    orderBy: { date: "desc" },
    take,
  });
};

export const insertDataSleep = async (date, hours, userId) => {
  return await prisma.sleep.upsert({
    where: { userId_date: { userId, date } },
    update: { hours },
    create: { date, hours, userId },
  });
};
