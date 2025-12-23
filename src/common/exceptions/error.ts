export class HttpException extends Error {
  public readonly statusCode;
  constructor(description: string, statusCode: number) {
    super(description);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    // captureStackTrace V8엔진 에서 stackTrace를 깔끔하게 유지시켜줍니다.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestException extends HttpException {
  constructor(description = "BAD_REQUEST") {
    super(description, 400);
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(description = "UNAUTHORIZED") {
    super(description, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(description = "FORBIDDEN") {
    super(description, 403);
  }
}

export class NotFoundException extends HttpException {
  constructor(description = "NOT_FOUND") {
    super(description, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(description = "CONFLICT") {
    super(description, 409);
  }
}

export class InternalServerException extends HttpException {
  constructor(description = "INTERNAL_SERVER_ERROR") {
    super(description, 500);
  }
}
