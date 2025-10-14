import { prisma } from '../db/prisma.js';

async function createComment(data) {
  return await prisma.comment.create({ data });
}

async function findCommentsInArticle() {
  return await prisma.$transaction([
    prisma.comment.count({ where: { parent: String('Article') } }),
    prisma.comment.findMany(
      { where: { parent: String('Article') } },
      { orderBy: { createdAt: 'desc' } },
    ),
  ]);
}

async function findCommentsByArticleId(articleId) {
  return await prisma.$transaction([
    prisma.comment.count({ where: { articleId: String(articleId) } }),
    prisma.comment.findMany(
      { where: { parent: String('Article') } },
      { orderBy: { createdAt: 'desc' } },
    ),
  ]);
}

async function findCommentsInProduct() {
  return await prisma.$transaction([
    prisma.comment.count({ where: { parent: String('Product') } }),
    prisma.comment.findMany(
      { where: { parent: String('Product') } },
      { orderBy: { createdAt: 'desc' } },
    ),
  ]);
}

async function findCommentsByProductId(productId) {
  return await prisma.$transaction([
    prisma.comment.count({ where: { productId: String(productId) } }),
    prisma.comment.findMany(
      { where: { parent: String('Product') } },
      { orderBy: { createdAt: 'desc' } },
    ),
  ]);
}

async function findCommentById(id) {
  return await prisma.comment.findUnique({ where: { id: String(id) } });
}

async function updateComment(id, data) {
  return await prisma.comment.update({ where: { id: String(id) }, data });
}

async function deleteComment(id) {
  return await prisma.comment.delete({ where: { id: String(id) } });
}

export const commentRepository = {
  findCommentsInArticle,
  findCommentsInProduct,
  findCommentsByArticleId,
  findCommentsByProductId,
  createComment,
  findCommentById,
  updateComment,
  deleteComment,
};

function Grogu() {}

Grogu();
