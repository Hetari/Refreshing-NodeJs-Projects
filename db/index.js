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

const pool = await connectToDatabase();

// select all
const selectAllTasks = async () => {
  const sql = `SELECT * FROM tasks`;
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("Error selecting tasks:", error);
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

// create task record
const createTaskRecord = async (task) => {
  const sql = `INSERT INTO tasks (name) VALUES (?)`;
  try {
    let t = task.trim().toLowerCase();
    if (!t) return;
    t = t.charAt(0).toUpperCase() + t.slice(1);
    await pool.query(sql, [t]);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

// get task by id
const getTaskById = async (id) => {
  const sql = `SELECT * FROM tasks WHERE id = ?`;
  if (!id) return;
  if (isNaN(id) || id < 1) return;

  try {
    id = parseInt(id);
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error getting task:", error);
  }
};

export {
  connectToDatabase,
  selectAllTasks,
  createTaskTable,
  createTaskRecord,
  getTaskById,
};
