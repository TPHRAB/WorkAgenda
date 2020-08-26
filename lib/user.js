const crypto = require('crypto');
const { getDBConnection } = require('./utils');

/**
 * Return the row associates with the username (param) if it exists
 * @param {Sqlite} db
 * @param {Sqlite} username
 */
const getUser = async (db, username) => {
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
   * @param {String} username - user input username
   * @param {String} password - user input password
   * @returns {Promise} - error message if failed
   */
  register: async (username, password, firstName, lastName) => {
    let db = await getDBConnection();
    let result = await getUser(db, username);

    if (result.length == 0) { // when the username (param) hasn't be registered
      let salt = generateSalt(16);
      let hash = generateHash(password, salt);
      // create user in database
      let statement = 'INSERT INTO \
                      users (username, password, salt, first_name, last_name) \
                      VALUES (?, ?, ?, ?, ?)';
      await db.run(statement, [username, hash, salt, firstName, lastName]);
    } else {
      return Promise.reject('Username has been registered');
    }

    await db.close();
  },

  /**
   * Login the system
   * @param {String} username - user input username
   * @param {String} password - user input password
   * @return {Promise} - error message if failed
   */
  login: async (username, password) => {
    let db = await getDBConnection();
    let row = await getUser(db, username);
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