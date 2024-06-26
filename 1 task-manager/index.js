import dotenv from 'dotenv';
import helmet from 'helmet';
import express from 'express';

import { router as tasks } from './routes/taskRoutes.js';
import { connectToDatabase, createTaskTable } from './db/index.js';
import { errorHandler } from './middleware/error.js';

// Load environment variables
dotenv.config();

// Port and host
const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || 'localhost';

// creating the app
const app = express();

// middlewares
app.use(express.static('public'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  } else next();
});

// routers
app.use('/api/v1/tasks', tasks);

// if there is no route
app.use('*', (req, res) => {
  return res.status(404).send('Route not found');
});

app.use(errorHandler);

// start the server
try {
  const pool = await connectToDatabase();
  app.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);
  });

  // create all table in db
  await createTaskTable(pool);
} catch (error) {
  console.log(error);
}
