import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import pool from '../db/connect.js';
import { createUser } from '../db/index.js';
import { BadRequestError } from '../errors/index.js';
import jsonwebtoken, { decode } from 'jsonwebtoken';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // validate user input
  if (!name || !email || !password) {
    throw new BadRequestError('All fields are required');
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    throw new BadRequestError('All fields must be strings');
  }

  if (name.length < 3 || name.length > 50) {
    throw new BadRequestError('Name must be between 3 and 50 characters long');
  }

  if (password.length < 8) {
    throw new BadRequestError('Password must be at least 8 characters long');
  }

  const userId = await createUser(pool, { name, email, password });

  if (!userId) {
    throw new Error('Failed to create user');
  }
  // create jwt
  const token = jsonwebtoken.sign(
    { userId, username: name },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return res
    .status(StatusCodes.CREATED)
    .json({ token, message: ReasonPhrases.CREATED });
};

const login = async (req, res) => {
  return res.json({ message: 'login' });
};

export { register, login };
