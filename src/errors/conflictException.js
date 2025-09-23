import { HttpException } from './httpException.js';

export class ConflictException extends HttpException {
  constructor(description = 'CONFILCT') {
    super(description, 409);
  }
}
