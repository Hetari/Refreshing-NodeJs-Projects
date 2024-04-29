// import mysql from 'mysql2';
import { readFile } from 'fs/promises';

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { connect } from 'http2';

const filePath = new URL('../products.json', import.meta.url);
const products = JSON.parse(await readFile(filePath));

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
  const sql = `CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  featured BOOLEAN DEFAULT false,
  rating smallint NOT NULL DEFAULT 0,
  company ENUM('marcos', 'liddy', 'ikea', 'caressa') NOT NULL DEFAULT 'marcos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await connection.query(sql);
    deleteProductTable(connection);
    productSeed(connection);
    process.exit(0);
  } catch (error) {
    throw error;
  }
};

const deleteProductTable = async (connection) => {
  const sql = `DELETE FROM products`;
  try {
    await connection.query(sql);
  } catch (error) {
    throw error;
  }
};

const productSeed = async (connection) => {
  try {
    products.forEach(async (product) => {
      await connection.query('INSERT INTO products SET ?', product);
    });
  } catch (error) {
    throw error;
  }
};

const allProducts = async (connection) => {
  const sql = `SELECT * FROM products`;
  try {
    const [rows] = await connection.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

export { connectToDatabase, createProductTable, productSeed, allProducts };
