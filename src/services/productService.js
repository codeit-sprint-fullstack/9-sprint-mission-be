import productRepository from "../repositories/productRepository.js";

async function getById(id) {
  const product = await productRepository.getById(id);
  if (!product) {
    const error = new Error("페이지를 찾을 수 없습니다");
    error.code = 404;
    throw error;
  }
  return product;
}

async function create(product) {
  return await productRepository.save(product);
}

export default {
  getById,
  create,
};
