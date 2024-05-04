import jsonwebtoken, { decode } from 'jsonwebtoken';
import { CustomErrorHandling as CustomAPIError } from '../errors/custom-error.js';
import { StatusCodes } from 'http-status-codes';

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    throw new CustomAPIError('Provide a user name or password', 400);

  const id = Math.floor(Math.random() * 99);
  console.log(id);
  const token = jsonwebtoken.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return res.status(200).json({ msg: 'User login', token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new CustomAPIError('No token has provide', 401);

  const token = authHeader.split(' ')[1];

  // verify the token
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const num = Math.floor(Math.random() * 100);
    return res
      .status(200)
      .json({ msg: `Hello ${decoded.username}`, secret: num });
  } catch (error) {
    throw new CustomAPIError('Not authorized to access this route', 401);
  }
};

export { login, dashboard };
