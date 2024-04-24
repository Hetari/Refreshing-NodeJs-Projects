// import mysql from 'mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection to the database
const connectToDatabase = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    debug: false,
    connectionLimit: 10,
  });

  if (pool) return pool;
  else throw new Error('Database connection failed');
  // const connection = await pool.getConnection();
  // return connection;
};

const createProductTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      featured BOOLEAN DEFAULT false,
      company VARCHAR(255) NOT NULL
    )
  `;
  try {
    await connection.query(sql);
  } catch (error) {
    throw error;
  }
};

export { connectToDatabase, createProductTable };
