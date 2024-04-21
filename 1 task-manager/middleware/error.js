import { apiError } from '../errors/index.js';

const errorHandler = (error, req, res, next) => {
  if (error instanceof apiError) {
    return res.status(error.status).json({ error: error.message });
  }
  return res.status(500).json({ error: 'Internal server error' });
};

export { errorHandler };
