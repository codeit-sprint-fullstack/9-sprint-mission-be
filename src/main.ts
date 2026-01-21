import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";

import { AuthRouter } from "./interface/AuthRouter";
import { ArticleRouter } from "./interface/ArticleRouter";
import { ProductRouter } from "./interface/ProductRouter";
import { CommentRouter } from "./interface/CommentRouter";
import { ImageRouter } from "./interface/ImageRouter";
import { UserRouter } from "./interface/UserRouter";
import { HTTP_PORT } from "./constant/env";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    yaml.parse(
      fs.readFileSync(path.join(path.resolve(), "openapi.yaml"), "utf-8")
    )
  )
);

/**
 * 현재 디렉터리의 public 폴더를 외부 브라우저에서 접근할 수 있도록 설정합니다.
 * static 이라는 이름으로 접근할 수 있습니다.
 *
 * @example http://localhost:3000/static/images/sample-image.jpg
 */
app.use("/static", express.static(path.join(path.resolve(), "public/")));

app.use("/auth", AuthRouter);
app.use("/articles", ArticleRouter);
app.use("/products", ProductRouter);
app.use("/comments", CommentRouter);
app.use("/images", ImageRouter);
app.use("/users", UserRouter);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send({
      message: "예기치 못한 오류가 발생했습니다.",
    });
  }
);

app.listen(HTTP_PORT, () => console.log(`Server started on port: ${HTTP_PORT}`));
