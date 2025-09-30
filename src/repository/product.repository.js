import { prisma } from '../db/prisma.js';

async function createProduct(data) {
  return await prisma.product.create({ data });
}

async function findProductsMany(options) {
  return await prisma.$transaction([
    prisma.product.count({ where: options.where }),
    prisma.product.findMany(options),
  ]);
}

async function findProductById(id) {
  return await prisma.product.findUnique({ where: { id: Number(id) } });
}

async function updateProduct(id, data) {
  return await prisma.product.update({ where: { id: Number(id) }, data });
}

async function deleteProduct(id) {
  return await prisma.product.delete({ where: { id: Number(id) } });
}

export const productRepository = {
  createProduct,
  findProductById,
  findProductsMany,
  updateProduct,
  deleteProduct,
};
