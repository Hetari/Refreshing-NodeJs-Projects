import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import redis from 'redis';

const app = express();

app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(xssClean());

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
});

const setupRedis = async () => {
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  await redisClient.connect();

  return redisClient;
};

const start = () => {
  const redisClient = setupRedis();

  const port = process.env.PORT || 3000 || 3001 || 3002;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

start();
