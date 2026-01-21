import { RequestHandler, Response } from "express";
import superstruct from "superstruct";
import { HttpException } from "../../exceptions/HttpException";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { InternalServerErrorException } from "../../exceptions/InternalServerErrorException";

export function asyncErrorHandler(handler: RequestHandler): RequestHandler {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (e) {
      const httpException = mapToHttpException(e);
      handleHttpException(httpException, res);
    }
  };
}

function handleHttpException(httpError: HttpException, res: Response) {
  res.status(httpError.status).send({
    name: httpError.name,
    message: httpError.message,
  });
}

function mapToHttpException(e: unknown): HttpException {
  if (e instanceof HttpException) {
    return e;
  }

  if (e instanceof superstruct.StructError) {
    return new BadRequestException(e.message);
  }

  return new InternalServerErrorException(
    e instanceof Error ? e.message : "Unknown Error"
  );
}
