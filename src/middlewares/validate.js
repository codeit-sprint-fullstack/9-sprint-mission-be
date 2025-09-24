import z from "zod";

export const validateQuery = (schema) => (req, res, next) => {
  try {
    schema.parse(req.query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Failed validateQuery",
        errors: error.issues,
      });
    }
    next(error);
  }
  next();
};

export const validateBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Faild validateBody",
        errors: error.issues,
      });
    }
    next(error);
  }
};
