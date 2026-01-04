import { ArticleController } from "./article.controller";
import { ArticleService } from "../services/article.service";
import { articleRepository } from "../repositories/article.repository";

import { ItemController } from "./item.controller";
import { ItemService } from "../services/item.service";
import { itemRepository } from "../repositories/item.repository";

import { AuthController } from "./auth.controller";
import { AuthService } from "../services/auth.service";
import { authRepository } from "../repositories/auth.repository";

import { UserController } from "./user.controller";
import { UserService } from "../services/user.service";
import { userRepository } from "../repositories/user.repository";

/** @see  https://alexkondov.com/tao-of-node/#consider-di-over-mocking */

const articleService = new ArticleService(articleRepository);
export const articleController = new ArticleController(articleService);

const itemService = new ItemService(itemRepository);
export const itemController = new ItemController(itemService);

const authService = new AuthService(authRepository);
export const authController = new AuthController(authService);

const userService = new UserService(userRepository);
export const userController = new UserController(userService);
