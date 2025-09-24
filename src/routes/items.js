import express from "express";
import { z } from "zod";
import { Product } from "../models/product.model.js";
import { validateProduct } from "../middlewares/validateProduct.js";
import { NotFoundException } from "../errors/notFoundException.js";

export const itemRouter = express.Router();

itemRouter.get("/", async (req, res, next) => {
  try {
    const {
      page = z.number().min(1).default(),
      limit = z.number().default(10),
      keyword = z.string().default(""),
      orderBy = z.enum(["recent", "oldest"]).default("recent"),
    } = req.query;
    const total = await Product.countDocuments();
    const totalPage = Math.ceil(limit / total);

    let sortOptions = {};
    if (orderBy === "recent") {
      sortOptions = { createAt: -1 };
    }
    if (orderBy === "oldest") {
      sortOptions = { createAt: 1 };
    }

    const product = await Product.find({
      /** @see https://www.mongodb.com/docs/manual/reference/operator/query/regex/ */
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .sort(sortOptions)
      .skip(limit * (page - 1))
      .limit(limit);

    res.json({
      success: true,
      message: "sucess get products",
      data: product,
      pagination: {
        page,
        limit,
        total,
        totalPage,
      },
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
    const productId = req.params.productId;
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
      { new: true },
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
