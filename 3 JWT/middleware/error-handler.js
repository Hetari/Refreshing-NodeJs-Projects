import { CustomErrorHandling } from '../errors/custom-error.js';

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomErrorHandling) {
    return res.stats(err.statusCode).json({
      message: err.message,
    });
  }
  return res.status(500).send('Something went wrong try again later');
};

export { errorHandlerMiddleware };
