import express from "express";
import { Product } from "../models/product.model.js";
import { validateProduct } from "../middlewares/validateProduct.js";
import { NotFoundException } from "../errors/notFoundException.js";

export const itemRouter = express.Router();

itemRouter.get("/", async (req, res, next) => {
  try {
    const product = await Product.find();
    res.json({
      success: true,
      message: "sucess get products",
      data: product,
      count: product.length,
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundException("not found product");
    }
    res.json({
      success: true,
      message: `find product`,
      data: product,
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.post("/", validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    // 중고마켓 특성상 중복된 상품
    // const existingProduct = await Product.findOne({})
    const newProduct = new Product({ name, description, price, tags });
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "success create product",
      data: newProduct,
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId
    const deleteProduct = await Product.findByIdAndDelete(productId);

    if (!deleteProduct) {
      throw new NotFoundException("not found product");
    }
    res.json({
      success: true,
      message: "success create product",
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.patch("/:productId", validateProduct, async (req, res, next) => {
  try {
    const { productId } = req.params.productId;
    const { name, description, price, tags } = req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        tags,
      },
      { new: true }
    );

    if (!updateProduct) {
      throw new NotFoundException("failed update product");
    }

    res.json({
      success: true,
      message: "success update product",
      data: updateProduct,
    });
  } catch (error) {
    next(error);
    return;
  }
});
