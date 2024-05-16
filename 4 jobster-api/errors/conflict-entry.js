import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class ConflictEntryError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ConflictEntryError;
