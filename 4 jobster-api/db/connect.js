import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();
// Creates a database if it does not already exist.
const createDatabase = async (pool, dbName) => {
  const connection = await pool.getConnection();
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  connection.release();
};

//  Creates a MySQL connection pool.
const createPool = (dbName = null) => {
  const poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit: 5,
  };

  if (dbName) {
    poolConfig.database = process.env.DB_NAME;
  }

  return mysql.createPool(poolConfig);
};

// Connects to the specified database, creating it if it does not exist.
const connectToDatabase = async () => {
  let pool = createPool(process.env.DB_NAME);

  try {
    await pool.getConnection();
  } catch (err) {
    if (err.sqlState === '42000') {
      // Handle the case where the database does not exist
      console.error(
        `Database '${process.env.DB_NAME}' does not exist. Creating database...`
      );

      pool = createPool();

      // Create the database
      await createDatabase(pool, process.env.DB_NAME);

      // Reconnect to the database with the DB name
      pool = createPool(process.env.DB_NAME);

      // Test the new connection
      await pool.getConnection();
    } else {
      // Throw error if it's not a 'database does not exist' error
      throw err;
    }
  }

  console.log(`Connected to the '${process.env.DB_NAME}' database`);
  return pool;
};

const pool = await connectToDatabase();

export default pool;
