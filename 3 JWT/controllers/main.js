import jsonwebtoken, { decode } from 'jsonwebtoken';
import { BadRequest } from '../errors/index.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    throw new BadRequest('Provide a user name or password');

  const id = Math.floor(Math.random() * 99);

  const token = jsonwebtoken.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return res.status(200).json({ msg: 'User login', token });
};

const dashboard = async (req, res) => {
  const user = req.user;

  // verify the token
  const num = Math.floor(Math.random() * 100);

  return res
    .status(200)
    .json({ msg: `Hello ${user.username} | ${user.id}`, secret: num });
};

export { login, dashboard };
