import express from "express";
import connectDB from "./db/index";
import { config } from "./config/config";

const PORT = 3000;

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.PORT, () => {
  console.log("Server running on http://localhost" + config.PORT);
});