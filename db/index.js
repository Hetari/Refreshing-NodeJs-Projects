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

// A simple SELECT query
try {
  const [results, fields] = await connection.query("");

  // results contains rows returned by server
  console.log(results);

  // fields contains extra meta data about results, if available
  console.log(fields);
} catch (err) {
  console.log(err);
}
