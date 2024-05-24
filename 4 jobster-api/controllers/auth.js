import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import pool from '../db/connect.js';
import { insertUser, getUser } from '../db/index.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import bcrypt from 'bcrypt';

import generateToken from '../functions/index.js';

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

  const userId = await insertUser(pool, { name, email, password });

  if (!userId) {
    throw new BadRequestError('Failed to create user');
  }

  // create jwt
  const token = generateToken(userId, name);

  return res.status(StatusCodes.CREATED).json({
    user: { username: name },
    token,
    message: ReasonPhrases.CREATED,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new BadRequestError('Email and password must be strings');
  }

  // Check if the user exists in the database
  const user = await getUser(pool, email, ['id', 'name', 'email', 'password']);

  if (!user) {
    throw new UnauthenticatedError('Invalid email or password');
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError('Invalid email or password');
  }

  // Generate a token
  const token = generateToken(user.id, user.name);

  // Send the response
  return res.json({ message: 'Login successful', token });
};

export { register, login };
