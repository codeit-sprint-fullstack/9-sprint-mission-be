import express from "express";
import auth from "../middlewares/authHandler.js";
import productService from "../services/productService.js";

const productRouter = express.Router();

productRouter.post("/", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productData = req.body;
    const createdProduct = await productService.create(productData, userId);

    return res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "recent",
      keyword = "",
    } = req.query;
    const products = await productService.getList({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      orderBy,
      keyword,
    });
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.getById(productId);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

productRouter.patch("/:productId", auth.verifyAccessToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    const updatedProduct = await productService.update(
      productId,
      userId,
      updateData
    );
    return res.status(201).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});
productRouter.delete(
  "/:productId",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
      await productService.deleteProduct(productId, userId);
      return res.status(204);
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
