import { readFile } from 'fs/promises';

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

import { isBool } from '../functions/index.js';

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

const getProduct = async (connection, options) => {
  // Validate options
  if (!options || typeof options !== 'object') {
    throw new Error('Options should be an object');
  }

  let sql = 'SELECT * FROM products WHERE ';
  const params = {};

  if (options.id !== undefined) {
    if (typeof options.id !== 'string' || isNaN(options.id))
      throw new Error('Id should be a string');
    params.id = options.id;
  }

  if (options.name !== undefined) {
    if (typeof options.name !== 'string')
      throw new Error('Id should be a string');

    params.name = options.name;
  }

  if (options.company !== undefined) {
    if (typeof options.company !== 'string')
      throw new Error('Company should be a string');

    params.company = options.company;
  }

  if (options.featured !== undefined) {
    if (!isBool(options.featured))
      throw new Error('Featured should be a boolean or an integer (0 or 1)');

    params.featured = options.featured;
  }

  if (Object.keys(params).length === 0) {
    throw new Error('No options provided');
  }

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      if (key === 'name') {
        sql += `${key} LIKE ? AND `;
      } else {
        sql += `${key} = ? AND `;
      }
    }
  }

  sql = sql.slice(0, -4);
  const newParams = Object.entries(params).map(([key, value]) => {
    return key === 'name' ? `%${value}%` : value;
  });

  try {
    const rows = await connection.query(sql, newParams);
    return rows;
  } catch (error) {
    throw error;
  }
};

export { connectToDatabase, createProductTable, allProducts, getProduct };
