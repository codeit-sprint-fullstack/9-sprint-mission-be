import { prisma } from '../db/prisma.js';

async function createArticle(data) {
  return await prisma.article.create({ data });
}

async function findArticlesMany(options) {
  return await prisma.$transaction([
    prisma.article.count({ where: options.where }),
    prisma.article.findMany(options),
  ]);
}

async function findArticleById(id) {
  return await prisma.article.findUnique({ where: { id: String(id) } });
}

async function updateArticle(id, data) {
  return await prisma.article.update({ where: { id: String(id) }, data });
}

async function deleteArticle(id) {
  return await prisma.article.delete({ where: { id: String(id) } });
}

export const articlesRepository = {
  createArticle,
  findArticleById,
  findArticlesMany,
  updateArticle,
  deleteArticle,
};
