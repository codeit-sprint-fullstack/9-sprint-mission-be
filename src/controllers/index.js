import { ArticleController } from "./article.controller.js";
import { ArticleService } from "../services/article.service.js";
import { articleRepository } from "../repositories/article.repository.js";
import { ItemController } from "./item.controller.js";
import { ItemService } from "../services/item.service.js";
import { itemRepository } from "../repositories/item.repository.js";

/** @see  https://alexkondov.com/tao-of-node/#consider-di-over-mocking */

const articleService = new ArticleService(articleRepository);
export const articleController = new ArticleController(articleService);

const itemService = new ItemService(itemRepository);
export const itemController = new ItemController(itemService);
