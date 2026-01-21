import express from "express";
import { create } from "superstruct";
import { AuthTokenManager } from "../infra/AuthTokenManager";
import { asyncErrorHandler } from "./utils/asyncErrorHandler";
import { AuthN } from "./utils/AuthN";
import { CreateProductRequestStruct } from "./structs/product/CreateProductRequestStruct";
import { UpdateProductRequestStruct } from "./structs/product/UpdateProductRequestStruct";
import { GetProductListRequestStruct } from "./structs/product/GetProductListRequestStruct";
import { CreateCommentRequestStruct } from "./structs/comment/CreateCommentRequestStruct";
import { GetCommentListRequestStruct } from "./structs/comment/GetCommentListRequestStruct";
import { CreateProductHandler } from "../application/product/CreateProductHandler";
import { GetProductHandler } from "../application/product/GetProductHandler";
import { UpdateProductHandler } from "../application/product/UpdateProductHandler";
import { DeleteProductHandler } from "../application/product/DeleteProductHandler";
import { GetProductListHandler } from "../application/product/GetProductListHandler";
import { CreateProductCommentHandler } from "../application/product/CreateProductCommentHandler";
import { GetProductCommentListHandler } from "../application/product/GetProductCommentListHandler";
import { CreateProductLikeHandler } from "../application/product/CreateProductLikeHandler";
import { DeleteProductLikeHandler } from "../application/product/DeleteProductLikeHandler";

export const ProductRouter = express.Router();

// 상품 등록 api
ProductRouter.post(
  "/",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const { name, description, price, tags, images } = create(
      req.body,
      CreateProductRequestStruct
    );

    const productView = await CreateProductHandler.handle(requester, {
      name,
      description,
      price,
      tags,
      images,
    });

    res.status(201).send(productView);
    return;
  })
);

// 상품 조회 api
ProductRouter.get(
  "/:productId",
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromTokenOrDefault(
      req.headers.authorization
    );

    const { productId } = req.params;

    const productView = await GetProductHandler.handle(requester, {
      productId: Number(productId),
    });

    res.send(productView);
    return;
  })
);

// 상품 수정 api
ProductRouter.patch(
  "/:productId",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const { productId } = req.params;
    const { name, description, price, tags, images } = create(
      req.body,
      UpdateProductRequestStruct
    );

    const productView = await UpdateProductHandler.handle(requester, {
      productId: Number(productId),
      name,
      description,
      price,
      tags,
      images,
    });

    res.send(productView);
    return;
  })
);

// 상품 삭제 api
ProductRouter.delete(
  "/:productId",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const { productId } = req.params;

    await DeleteProductHandler.handle(requester, {
      productId: Number(productId),
    });

    res.status(204).send();
    return;
  })
);

// 상품 목록 조회 api
ProductRouter.get(
  "/",
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromTokenOrDefault(
      req.headers.authorization
    );

    const { page, pageSize, orderBy, keyword } = create(
      req.query,
      GetProductListRequestStruct
    );

    const productListView = await GetProductListHandler.handle(requester, {
      page,
      pageSize,
      orderBy,
      keyword,
    });

    res.send(productListView);
    return;
  })
);

// 상품 댓글 등록 api
ProductRouter.post(
  "/:productId/comments",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const { productId } = req.params;
    const { content } = create(req.body, CreateCommentRequestStruct);

    const productCommentView = await CreateProductCommentHandler.handle(
      requester,
      {
        productId: Number(productId),
        content,
      }
    );

    res.status(201).send(productCommentView);
    return;
  })
);

// 상품 댓글 목록 조회 api
ProductRouter.get(
  "/:productId/comments",
  asyncErrorHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor, limit } = create(req.query, GetCommentListRequestStruct);

    const productCommentListView = await GetProductCommentListHandler.handle({
      productId: Number(productId),
      cursor,
      limit,
    });

    res.send(productCommentListView);
    return;
  })
);

// 상품 좋아요 API
ProductRouter.post(
  "/:productId/favorite",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const productId = Number(req.params.productId);

    const productView = await CreateProductLikeHandler.handle(requester, {
      productId,
    });

    res.status(201).send(productView);
    return;
  })
);

// 상품 좋아요 취소 API
ProductRouter.delete(
  "/:productId/favorite",
  AuthN(),
  asyncErrorHandler(async (req, res) => {
    const requester = AuthTokenManager.getRequesterFromToken(
      req.headers.authorization
    );

    const productId = Number(req.params.productId);

    const productView = await DeleteProductLikeHandler.handle(requester, {
      productId,
    });

    res.status(201).send(productView);
    return;
  })
);
