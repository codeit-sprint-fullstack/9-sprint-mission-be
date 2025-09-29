import { Product } from "../../models/product.model.js";
import { NotFoundException } from "../../common/exceptions/notFoundException.js";

// "get AllItems"
export const getItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;
    const total = await Product.countDocuments();
    const totalPage = Math.ceil(total / limit);

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
};

// getItemsById
export const getItemById = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { item } = await Product.findById(itemId);
    if (!item) {
      throw new NotFoundException("not found item");
    }
    res.json({
      sucess: true,
      message: "fined items",
      data: item,
    });
  } catch (error) {
    next(error);
    return;
  }
};

// createItemsHander
export const createItem = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const newItem = await Product({ name, description, price, tags });
    await newItem.save();
    res.status(201).json({
      success: true,
      message: "success create Item",
      data: newItem,
    });
  } catch (error) {
    next(error);
    return;
  }
};

//deleteItemHandler
export const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const deleteItem = await Product.findByIdAndDelete(itemId);

    if (!deleteItem) {
      throw new NotFoundException("not found item");
    }
    res.josn({
      success: true,
      message: "success delete item",
    });
  } catch (error) {
    next(error);
    return;
  }
};

//patchItemHandler
export const patchItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { name, description, price, tags } = req.body;

    const updateItem = await Product.findByIdAndUpdate(
      itemId,
      {
        name,
        description,
        price,
        tags,
      },
      { new: true },
    );

    if (!updateItem) {
      throw new NotFoundException("failed update item");
    }

    res.json({
      success: true,
      message: "success update item",
      data: updateItem,
    });
  } catch (error) {
    next(error);
    return;
  }
};
