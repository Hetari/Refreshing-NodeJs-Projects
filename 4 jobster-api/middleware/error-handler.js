import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors/index.js';

/**
 * Middleware function to handle errors thrown by the application.
 * This function takes four parameters: the error, the request, the response, and the next function.
 *
 * @param {Error} err - The error object thrown by the application.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  // Check if the error is an instance of CustomAPIError
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  // If the error is of any other type, send a JSON response with the error object and internal server error status code
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

export default errorHandlerMiddleware;
