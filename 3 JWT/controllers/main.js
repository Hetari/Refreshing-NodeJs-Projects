import { CustomErrorHandling as CustomAPIError } from '../errors/custom-error.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    throw new CustomAPIError('Provide a user name or password', 400);

  return res.send('fake login');
};

const dashboard = async (req, res) => {
  const num = Math.floor(Math.random() * 100);
  return res.status(200).json({ message: 'Hello world', secret: num });
};

export { login, dashboard };
