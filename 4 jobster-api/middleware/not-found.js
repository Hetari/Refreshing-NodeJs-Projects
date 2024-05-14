import { StatusCodes } from 'http-status-codes';

/**
 * A middleware function that handles requests to non-existing routes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} - The response object with a 404 status and a message
 */
const notFoundMiddleware = (req, res) => {
  // Set the response status code to 404 (Not Found)
  res.status(StatusCodes.NOT_FOUND);
  // Send a message with the response indicating that the route does not exist
  return res.send('Route does not exist');
};

export default notFoundMiddleware;
