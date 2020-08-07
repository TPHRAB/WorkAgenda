const crypto = require('crypto');
const { getDBConnection } = require('./utils');
const { ClientError } = require('../errors/ClientError');

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

module.exports = {
  /**
   * Create a user in the database
   * @returns {Promise} - error message if failed
   */
  register: async (username, password) => {
    let db = await getDBConnection();
    let result = await userExists(db, username);

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
  },

  /**
   * Login the system
   * @return {Promise} - error message if failed
   */
  login: async (username, password) => {
    let db = await getDBConnection();
    let row = await userExists(db, username);
    let userExists = row.length != 0;
    let passwordCorrect;
    if (userExists) {
      // username exists, then check password
      row = row[0]; // username is primary key
      passwordCorrect = (generateHash(password, row.salt) == row.password);
    }
    await db.close();
    if (!userExists || !passwordCorrect) {
      return Promise.reject('Invalid username or password');
    }
  }
};