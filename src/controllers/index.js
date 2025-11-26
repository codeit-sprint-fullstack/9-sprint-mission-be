import { ArticleController } from "./article.controller.js";
import { ArticleService } from "../services/article.service.js";
import { articleRepository } from "../repositories/article.repository.js";

import { ItemController } from "./item.controller.js";
import { ItemService } from "../services/item.service.js";
import { itemRepository } from "../repositories/item.repository.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { authRepository } from "../repositories/auth.repository.js";

import { UserController } from "./user.controller.js";
import { UserService } from "../services/user.service.js";
import { userRepository } from "../repositories/user.repository.js";

import { CommentController } from "./comment.controller.js";
import { CommentService } from "../services/comment.service.js";
import { commentRepository } from "../repositories/comment.repository.js";

/** @see  https://alexkondov.com/tao-of-node/#consider-di-over-mocking */

const authService = new AuthService(authRepository);
export const authController = new AuthController(authService);

const userService = new UserService(userRepository);
export const userController = new UserController(userService);

const articleService = new ArticleService(articleRepository);
export const articleController = new ArticleController(articleService);

const itemService = new ItemService(itemRepository);
export const itemController = new ItemController(itemService);

const commentService = new CommentService(commentRepository);
export const commentController = new CommentController(commentService);
