import express from "express";
import { Product } from "../models/product.model.js";

export const itemRouter = express.Router();

itemRouter.get("/api/items", async (req, res, next) => {
  try {
    const product = await Product.find();
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.get("/api/items/:productId", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.post("/api/items", async (req, res, next) => {
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

itemRouter.delete("/api/items/:productId", async (req, res, next) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      throw new Error("not found product");
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

itemRouter.patch("/api/items/:productId", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const { productId } = req.params.id;

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
      throw new Error("failed update product");
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
