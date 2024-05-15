import pool from '../db/connect.js';
import { createUser } from '../db/index.js';
import { StatusCodes } from 'http-status-codes';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // validate user input
  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'All fields are required' });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'All fields must be strings' });
  }

  if (name.length < 3 || name.length > 50) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Name must be between 3 and 50 characters long' });
  }

  if (password.length < 8) {
    return res
      .status(StatusCodes.LENGTH_REQUIRED)
      .json({ message: 'Password must be at least 8 characters long' });
  }

  await createUser(res, pool, { name, email, password });
};

const login = async (req, res) => {
  return res.json({ message: 'login' });
};

export { register, login };
