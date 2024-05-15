import { createUser } from '../db/index.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // validate user input
  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).send('All fields are required');
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('All fields must be strings');
  }

  if (name.length < 3 || name.length > 50) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Name must be between 3 and 50 characters long');
  }

  if (password.length < 8) {
    return res
      .status(StatusCodes.LENGTH_REQUIRED)
      .send('Password must be at least 8 characters long');
  }

  res.send(`user register ${name}`);
};

const login = async (req, res) => {
  res.send('user login');
};

export { register, login };
