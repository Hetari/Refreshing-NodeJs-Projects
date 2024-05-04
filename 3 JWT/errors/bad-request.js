import { StatusCodes } from 'http-status-codes';
import { CustomErrorHandling } from './custom-error.js';

class BadRequest extends CustomErrorHandling {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export { BadRequest };
