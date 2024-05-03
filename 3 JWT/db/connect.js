import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectToDatabase = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    debug: false,
  });

  // test the connection
  await pool.getConnection();

  if (pool) return pool;
  else throw new Error('Database connection failed');
};

export { connectToDatabase };
