import { prisma } from '../db/prisma.js';

async function createComment(data) {
  return await prisma.comment.create({ data });
}

async function findCommentsWithCursor({ where, take, cursor }) {
  const findManyOptions = {
    take,
    where,
    orderBy: {
      createdAt: 'desc',
    },
  };

  if (cursor) {
    findManyOptions.cursor = { id: cursor }; // 커서의 시작점
    findManyOptions.skip = 1; // 커서 자체는 건너뛰기
  }

  const comments = await prisma.comment.findMany(findManyOptions);

  let nextCursor = null;
  // 요청한 개수만큼 결과가 있다면, 다음 페이지가 있을 가능성이 있음
  if (comments.length === take) {
    nextCursor = comments[comments.length - 1].id;
  }

  return { comments, nextCursor };
}

async function findCommentsInArticle({ take, cursor }) {
  return findCommentsWithCursor({ where: { parent: 'Article' }, take, cursor });
}

async function findCommentsByArticleId({ articleId, take, cursor }) {
  return findCommentsWithCursor({
    where: { articleId: String(articleId) },
    take,
    cursor,
  });
}

async function findCommentsInProduct({ take, cursor }) {
  return findCommentsWithCursor({ where: { parent: 'Product' }, take, cursor });
}

async function findCommentsByProductId({ productId, take, cursor }) {
  return findCommentsWithCursor({
    where: { productId: String(productId) },
    take,
    cursor,
  });
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

export const commentsRepository = {
  findCommentsInArticle,
  findCommentsInProduct,
  findCommentsByArticleId,
  findCommentsByProductId,
  createComment,
  findCommentById,
  updateComment,
  deleteComment,
};
