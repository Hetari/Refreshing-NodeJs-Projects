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
      //   connectionLimit: 10, // Adjust as needed
    });
    return pool;
  } catch (error) {
    throw error; // Throw error to indicate failure
  }
};

// // A simple SELECT query
// try {
//   const [results, fields] = await connection.query("");

//   // results contains rows returned by server
//   console.log(results);

//   // fields contains extra meta data about results, if available
//   console.log(fields);
// } catch (err) {
//   console.log(err);
// }

export { connectToDatabase };
