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
let redisClient;

app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(xssClean());

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
});

// Initialize Redis
(async () => {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  await redisClient.connect();
})();

const fetchApiData = async (species) => {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log('Request sent to the API');
  return apiResponse.data;
};

app.get('/todo/:id', async (req, res) => {
  const id = req.params.id;
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(id);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(id);
      if (results.length === 0) {
        throw 'API returned an empty array';
      }
      await redisClient.set(id, JSON.stringify(results), {
        EX: 10, // item will expire after 10 seconds
        NX: true // only set the key if it does not already exist
      });
    }

    res.send({
      fromCache: isCached,
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(404).send('Data unavailable');
  }
});

const start = async () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

start();
