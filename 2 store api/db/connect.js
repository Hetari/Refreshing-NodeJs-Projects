import { readFile } from 'fs/promises';

// import third-party modules
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// import my modules
import { sortingBy, validateOptions } from '../functions/index.js';

const connectToDatabase = async () => {
  // Load environment variables
  dotenv.config();

  // The MySQL pool that we'll use for our database connection.
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
  // reading all products
  const filePath = new URL('../products.json', import.meta.url);
  const products = JSON.parse(await readFile(filePath));

  try {
    products.forEach(async (product) => {
      await connection.query('INSERT INTO products SET ?', product);
    });
  } catch (error) {
    throw error;
  }
};

const allProducts = async (
  connection,
  fields,
  page = 1,
  pageSize = 10,
  sortBy = []
) => {
  let sql = `SELECT ${fields} FROM products`;
  const params = [];

  if (sortBy.length > 0) {
    sql = sortingBy(sql, sortBy);
  }

  // Calculate the offset based on the page number and page size
  const offset = (page - 1) * pageSize;

  sql += ` LIMIT ?, ?`;
  params.push(offset, pageSize);

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getProduct = async (connection, options) => {
  // Validate options for WHERE query
  const params = validateOptions(options);
  let sql = 'SELECT * FROM products WHERE ';

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
