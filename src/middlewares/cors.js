import { isDevelopment } from '../config/config';

export const cors = (req, res, next) => {
  const origin = req.headers.origin || req.headers.host || '';
  const whiteList = [];
  const isAllowed = isDevelopment || whiteList.includes(origin);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
