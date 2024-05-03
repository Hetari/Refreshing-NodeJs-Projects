import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { connectToDatabase } from './db/connect.js';

dotenv.config();

const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || 'localhost';
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// start the server
try {
  const pool = connectToDatabase();
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
} catch (error) {
  console.error(error);
}
