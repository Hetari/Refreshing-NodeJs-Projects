import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';

// DB connect
import connectToDatabase from './db/connect.js';

// extra security packages
import helmet from 'helmet';

// error handler
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// routes
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(helmet());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start the server
const start = async () => {
  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || 'localhost';

  try {
    const pool = connectToDatabase();
    app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
