export const validateProducts = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  if (!name || name.trim().length > 10) {
    return res.status(400).json({
      success: false,
      message: '상품명은 존재해야하며, 10자 이내여야 합니다.',
    });
  }

  if (
    !description ||
    description.trim().length < 10 ||
    description.trim().length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: '상품 설명은 존재해야하며, 10자 이상, 100자 이내여야 합니다.',
    });
  }

  if (!price || isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: '상품명은 존재해야하며, 숫자여야 합니다.',
    });
  }

  if (!tags || !tags.length) {
    return res.status(400).json({
      success: false,
      message: '태',
    });
  }

  next();
};
