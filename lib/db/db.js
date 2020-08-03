const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const { ClientError } = require('../errors/ClientError');

/**
 * Get database connection
 * @returns {db} - Sqlite connector
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  return db;
}

/**
 * Return the row associates with the username (param) if it exists
 * @param {Sqlite} db
 * @param {Sqlite} username
 */
const userExists = async (db, username) => {
  let query = 'SELECT * FROM users WHERE username = ?';
  return await db.all(query, [username]);
};

/**
 * Create a user in the database
 * @param {String} username
 * @param {String} password
 */
const register = async (username, password) => {
  let db = await getDBConnection();
  let result = await userExists(db);

  if (!result) { // when the username (param) hasn't be registered
    let salt = generateSalt(16);
    let hash = generateHash(password, salt);
    // create user in database
    let statement = `INSERT INTO users (username, password, salt) \
                     VALUES (?, ?, ?)`;
    await db.run(statement, [username, hash, salt]);
  } else {
    throw new ClientError('Username already been registered');
  }

  await db.close();
};

/**
 * Generate a random string
 * @param length - length of the string
 * @returns random string
 */
const generateSalt = (length) => {
  return crypto.randomBytes(length)
          .toString('hex')
          .slice(0, length);
};

/**
 * Combine password (param) and salt (param), and generate hash
 * @param {String} password
 * @param {String} salt
 */
const generateHash = (password, salt) => {
  return crypto
          .createHmac('sha512', salt)
          .update(password)
          .digest('hex');
};

const checkLogin = async (username, password) => {
  let db = await getDBConnection();
  let query; // stores sql
  let result; // store result of the query
  query = 'SELECT * FROM users WHERE username = ?';
  result = await db.all(query, [username]);
  if (result) {
    // username exists
    
    
  }
  await db.close();
  return result;
};

module.exports = {
  register,
  checkLogin
};