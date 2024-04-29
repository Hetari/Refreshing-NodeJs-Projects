// import mysql from 'mysql2';
import { readFile } from 'fs/promises';

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

  // Determine SQL query based on provided options
  let sql = 'SELECT * FROM products WHERE ';
  const params = [];

  // if only id is provided
  if (options.id !== undefined) {
    if (typeof options.id !== 'string' || isNaN(options.id)) {
      throw new Error('Id should be a string');
    }
    sql += 'id = ?';
    params.push(options.id);
  }

  // if only company and featured are provided
  else if (options.company !== undefined && options.featured !== undefined) {
    if (typeof options.company !== 'string') {
      throw new Error('Company should be a string');
    }

    // if featured is not a boolean or not a number [0 or 1]
    if (
      isNaN(options.featured) ||
      (typeof options.featured === 'number' &&
        ![1, 0].includes(options.featured))
    ) {
      throw new Error('Featured should be a boolean or an integer (0 or 1)');
    }

    sql += 'company = ? AND featured = ?';
    params.push(options.company, options.featured);
  }

  // if only company is provided
  else if (options.company !== undefined) {
    if (typeof options.company !== 'string') {
      throw new Error('Company should be a string');
    }
    sql += 'company = ?';
    params.push(options.company);
  }

  // if only featured is provided
  else if (options.featured !== undefined) {
    if (typeof options.featured !== 'boolean') {
      throw new Error('Featured should be a boolean');
    }
    sql += 'featured = ?';
    params.push(options.featured);
  }

  // if no options are provided
  else {
    throw new Error(
      'Please provide either id, company, or featured in options'
    );
  }

  try {
    const rows = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export { connectToDatabase, createProductTable, allProducts, getProduct };
