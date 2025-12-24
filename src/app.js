import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import authRouter from "./routes/authRouter.js";
import imageRouter from "./routes/imageRouter.js";
import productRouter from "./routes/productRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/images", express.static("public/images"));

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/images", imageRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
