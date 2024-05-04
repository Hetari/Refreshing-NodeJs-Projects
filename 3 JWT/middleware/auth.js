import jsonwebtoken from 'jsonwebtoken';
import { unauthenticatedError } from '../errors/index.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new unauthenticatedError('No token has provide');

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new unauthenticatedError('Not authorized to access this route');
  }
};

export { authMiddleware };
