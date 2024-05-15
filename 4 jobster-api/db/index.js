import { StatusCodes } from 'http-status-codes';
import mysql from 'mysql2/promise.js';

const createUserTable = async (pool) => {
  // TODO: check if the user name is less than 3 or > 50 and catch that error.
  //   password VARCHAR(255) NOT NULL,
  //   lastName VARCHAR(20) DEFAULT 'lastName',
  //   location VARCHAR(20) DEFAULT 'my city',
  const sql = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) BETWEEN 3 AND 50),    
    CONSTRAINT chk_password_length CHECK (CHAR_LENGTH(password) >= 6)
  );`;
  // CONSTRAINT chk_email_format CHECK (email REGEXP '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),

  await pool.query(sql);
  return true;
};

const createUser = async (res, pool, user) => {
  if (!user || Object.keys(user).length === 0) {
    throw new Error('User object is empty');
  }

  if (!user.name || !user.email || !user.password) {
    throw new Error('User object is missing required fields');
  }

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  try {
    const row = await pool.execute(sql, [user.name, user.email, user.password]);
    console.log(row[0].affectedRows);
  } catch (err) {
    if (err.errno === 1062 || err.sqlMessage.startsWith('Duplicate entry')) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Email is already registered' });
    } else {
      throw err;
    }
  }

  return res
    .status(StatusCodes.CREATED)
    .json({ message: ReasonPhrases.CREATED });
};

export { createUserTable, createUser };