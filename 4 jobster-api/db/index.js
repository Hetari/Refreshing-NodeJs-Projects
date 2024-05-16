import { BadRequestError, ConflictEntryError } from '../errors/index.js';
import bcrypt from 'bcrypt';

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

const createUser = async (pool, user) => {
  if (!user || Object.keys(user).length === 0) {
    throw new BadRequestError('User object is empty');
  }

  if (!user.name || !user.email || !user.password) {
    throw new BadRequestError('User object is missing required fields');
  }

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  // Generate a salt for hashing passwords with cost factor 10, it is basically random bytes
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(user.password, salt);

  try {
    const addUser = await pool.execute(sql, [
      user.name,
      user.email,
      encryptedPassword,
    ]);

    return addUser[0].insertId;
  } catch (err) {
    if (err.errno === 1062 || err.sqlMessage.startsWith('Duplicate entry')) {
      throw new ConflictEntryError('Email already exists');
    } else {
      throw new Error(err);
    }
  }
};

export { createUserTable, createUser };
