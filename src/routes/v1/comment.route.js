import express from "express";
import { commentController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";

export const commentRouter = express.Router({ mergeParams: true });

commentRouter.get("/", commentController.getComments);

commentRouter.post(
  "/",
  auth.verifyAccessToken,
  commentController.createCommentByItem
);

commentRouter.patch(
  "/:commentId",
  auth.verifyAccessToken,
  commentController.updateCommentByItemId
);

commentRouter.delete(
  "/:commentId",
  auth.verifyAccessToken,
  commentController.deleteCommentByItemId
);
