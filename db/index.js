import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create the connection to database
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DP_PASSWORD,
  database: process.env.DP_NAME,
});

// Create the connection to the database
const connectToDatabase = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // connectionLimit: 10, // Adjust as needed
    });
    // await createTaskTable(pool);
    return pool;
  } catch (error) {
    throw error; // Throw error to indicate failure
  }
};

// create task table in db
const createTaskTable = async (pool) => {
  const sql = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
  )`;

  try {
    await pool.query(sql);
  } catch (error) {
    console.error("Error creating task table:", error);
  }
};

export { connectToDatabase, createTaskTable };
