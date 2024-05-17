import jsonwebtoken from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import pool from '../db/connect.js';
import { getUser } from '../db/index.js';

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    // attach the user to job routes
    const user = await getUser(pool, payload.userId);

    // console.log('user: ', user);

    req.user = { userId: payload.userId, name: payload.username };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default auth;
