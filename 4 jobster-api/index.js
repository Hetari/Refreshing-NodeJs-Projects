import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';

// DB
import pool from './db/connect.js';
import { createUserTable, createJobTable } from './db/index.js';

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// error handler
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// routes
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

// middleware
import authMiddleware from './middleware/authentication.js';

dotenv.config();
const app = express();

// middlewares
app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(limiter);

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start the server
const start = async () => {
  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || 'localhost';

  try {
    await createUserTable(pool);
    await createJobTable(pool);
    app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
