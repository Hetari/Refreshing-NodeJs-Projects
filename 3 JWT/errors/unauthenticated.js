import { CustomErrorHandling } from './custom-error.js';
import { StatusCodes } from 'http-status-codes';

class unauthenticatedError extends CustomErrorHandling {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export { unauthenticatedError };
