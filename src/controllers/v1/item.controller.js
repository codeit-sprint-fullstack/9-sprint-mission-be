import { prisma } from "../../db/index.js";
import { NotFoundException } from "../../common/exceptions/notFoundException.js";
import { HttpStatus } from "../../common/constants/httpStatus.js";
import {
  FAILED_UPDATE_ITEM,
  NOT_FOUND_ITEM,
} from "../../common/constants/errorMessage.js";

// "get AllItems"
export const getItems = async (req, res, next) => {
  try {
    const {
      page: pageStr = 1,
      limit: limitStr = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;
    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const total = await prisma.item.count();
    const totalPage = Math.ceil(total / limit);

    const SORT_MAP = {
      recent: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    };

    const sortOptions = SORT_MAP[orderBy] ?? {};

    const product = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      },
      orderBy: sortOptions,
      skip: limit * (page - 1),
      take: limit,
    });

    res.status(HttpStatus.OK).json({
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
    const { item } = await prisma.item.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!item) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    res.status(HttpStatus.OK).json({
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

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.status(HttpStatus.CREATED).json({
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
    const deleteItem = await prisma.item.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!deleteItem) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    res.status(HttpStatus.OK).json({
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

    const updateItem = await prisma.item.update({
      where: { id: parseInt(itemId) },
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    if (!updateItem) {
      throw new NotFoundException(FAILED_UPDATE_ITEM);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success update item",
      data: updateItem,
    });
  } catch (error) {
    next(error);
    return;
  }
};
