import dotenv from 'dotenv';
import helmet from 'helmet';
import express from 'express';

import { productsRouter } from './routes/products.js';

import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { connectToDatabase, createProductTable } from './db/connect.js';
import { asyncWrapper } from './middleware/async.js';
dotenv.config();

const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || 'localhost';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/products', productsRouter);

app.use(errorHandlerMiddleware);
app.use(notFound);

// start the server
try {
  const pool = await connectToDatabase();
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  // create product table
  createProductTable(pool);
} catch (error) {
  console.log('error', error);
}
