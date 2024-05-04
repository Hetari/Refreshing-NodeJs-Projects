import { CustomErrorHandling } from '../errors/custom-error.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomErrorHandling) {
    return res.status(err.statusCode).json({
      msg: err.message,
    });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
};

export { errorHandlerMiddleware };
