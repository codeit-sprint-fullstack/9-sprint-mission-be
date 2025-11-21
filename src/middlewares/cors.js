import { isDevelopment } from "../config/config.js";

export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host || "";

  const whiteList = [
    "https://pandasmarket.netlify.app",
    "http://localhost:3000",
  ];
  const isAllowed = isDevelopment || whiteList.includes(origin);
  if (isAllowed) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }
  next();
};
