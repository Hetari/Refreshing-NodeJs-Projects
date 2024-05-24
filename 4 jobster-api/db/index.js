import {
  BadRequestError,
  ConflictEntryError,
  UnauthenticatedError,
} from '../errors/index.js';
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

const insertUser = async (pool, user) => {
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
  } catch (error) {
    if (
      error.errno === 1062 ||
      error.sqlMessage.startsWith('Duplicate entry')
    ) {
      throw new ConflictEntryError('Email already exists');
    } else {
      throw new Error(error);
    }
  }
};

const getUser = async (pool, prop, select = ['id', 'name', 'email']) => {
  try {
    let sql = `SELECT ${select.join(', ')} FROM users WHERE `;

    if (
      (typeof prop === 'string' && !isNaN(prop)) ||
      typeof prop === 'number'
    ) {
      sql += `id = ?`;
    } else if (typeof prop === 'string' && isNaN(prop)) {
      sql += `email = ?`;
    } else {
      throw new Error('Invalid sql prop');
    }

    // Execute the SQL query with the prop parameter
    const [rows] = await pool.execute(sql, [prop]);

    // Check if user is found
    if (rows.length === 0) {
      return null; // User not found
    }

    // Return the first user found
    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

// Jobs
const createJobTable = async (pool) => {
  const sql = `CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    status ENUM('interview', 'declined', 'pending') NOT NULL DEFAULT 'interview',
    created_by INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
  )`;
  // CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) BETWEEN 3 AND 50), CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) BETWEEN 3 AND 100),

  await pool.query(sql);
  return true;
};

const selectAllJobs = async (pool, criteria = {}, select = ['*']) => {
  // criteria is like: { status: 'interview', created_by: 1 }
  const validColumns = [
    'id',
    'name',
    'position',
    'status',
    'created_at',
    'updated_at',
    'created_by',
  ];

  let sql = `SELECT ${select.join(', ')} FROM jobs`;
  let queryParams = [];
  let conditions = [];

  // Iterate over the criteria object and construct the SQL query
  for (const [key, value] of Object.entries(criteria)) {
    if (validColumns.includes(key) && value !== undefined) {
      conditions.push(`${key} = ?`);
      queryParams.push(value);
    }
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const [rows] = await pool.query(sql, queryParams);
    return rows;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const insertJob = async (pool, job) => {
  // companyName, companyPosition, companyStatus;
  if (!job || Object.keys(job).length === 0) {
    throw new BadRequestError('Job object is empty');
  }

  if (!job.user) {
    throw new UnauthenticatedError('There is no authentication user!');
  }

  if (!job.company || !job.position || !job.status) {
    throw new BadRequestError('Job object is missing required fields');
  }

  const sql = `INSERT INTO jobs (name, position, status, created_by) VALUES (?, ?, ?, ?)`;

  try {
    const addJob = await pool.execute(sql, [
      job.company,
      job.position,
      job.status,
      job.user.id,
    ]);

    // or insertId:
    return addJob[0].affectedRows;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  createUserTable,
  createJobTable,
  insertUser,
  getUser,
  selectAllJobs,
  insertJob,
};
