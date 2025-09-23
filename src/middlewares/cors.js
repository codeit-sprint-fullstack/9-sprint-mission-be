export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host || "";
  const isDev = process.env.NODE_NEV !== "production";

  const whiteList = [];
  const isAllowed = isDev || whiteList.includes(origin);
  if (isAllowed) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Method", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
};
