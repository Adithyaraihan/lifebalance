import { prisma } from "../../db/database.js";

export const getArticle = async () => {
  return await prisma.article.findMany();
};
