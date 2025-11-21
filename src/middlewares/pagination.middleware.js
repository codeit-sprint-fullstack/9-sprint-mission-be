export const parsePagination = (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const cursor = req.query.cursor;

  req.pagination = {
    take: pageSize,
    cursor,
  };
  next();
};
