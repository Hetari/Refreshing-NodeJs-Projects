import jsonwebtoken from 'jsonwebtoken';
import { CustomErrorHandling as CustomAPIError } from '../errors/custom-error.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new CustomAPIError('No token has provide', 401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new CustomAPIError('Not authorized to access this route', 401);
  }
};

export { authMiddleware };
