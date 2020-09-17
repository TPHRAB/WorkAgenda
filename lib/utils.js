const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const moment = require('moment');

/**
 * Check if the user is involved in the project
 * @param {db} - database connection
 * @param {string} username
 * @param {number} pid - project id
 * @return {Promise}
 */
const involvedInProject = async (db, username, pid) => {
    // check pid exist and the user is involved
    let query = 'SELECT * FROM user_projects WHERE username = ? AND pid = ?';
    let userInvolved = await db.get(query, [username, pid]);
    if (!userInvolved) {
        // if the user aren't involved in the project
        await Promise.reject(`${username} isn't involved in project ${pid}`);
    }
};

module.exports = {
  /**
   * Get database connection
   * @returns {Promise} - Sqlite connector
   */
  getDBConnection: async () => {
    const db = await sqlite.open({
      filename: './database.db',
      driver: sqlite3.Database
    });
    return db;
  },

  /**
   * @returns {string} current date in format YYYY-MM-DD
   */
  currentDate: () => {
    return moment().format('YYYY-MM-DD');
  },

  /**
   * @returns {string} current time in fomrat YYYY-MM-DD HH:mm:ss.SSS
   */
  currentTime: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  },

  involvedInProject,

  /**
   * Check if user is allowed to view or edit the bug
   * @param {db} db - database connection
   * @param {string} username
   * @param {number} bid - bug id
   */
  accessibleBug: async (db, username, bid) => {
    // get bug pid
    let query = 'SELECT pid FROM bugs WHERE bid = ?';
    let result = await db.get(query, [bid]);

    if (!result)
      await Promise.reject(`Bug ${bid} doesn't exist`);

    await involvedInProject(db, username, result.pid);
  },

  getLastInsertedId: async (db) => {
    let query = 'SELECT last_insert_rowid()';
    let pid = await db.get(query);
    return pid['last_insert_rowid()'];
  },

  /**
   * Check whether the user is the owner of the project
   * @param {sqlite3} db
   * @param {string} username
   * @param {number} pid - project id
   */
  isOwner: async (db, username, pid) => {
    let query = 'SELECT owner FROM projects WHERE pid = ?';
    let result = await db.get(query, [pid]);
    if (!result)
      await Promise.reject('Project doesn\'t exist');
    else if (result.owner !== username)
      await Promise.reject(`${username} is not the owner of project ${pid}`);
  },

  /**
   * Set user involved in a project
   * @param {sqlite3} db
   * @param {string} username
   * @param {number} pid - project id
   */
  createConnection: async (db, username, pid) => {
    let statement = 'INSERT INTO user_projects (username, pid) VALUES (?, ?)';
    await db.run(statement, [username, pid]);
  },

  /**
   * Check whether the user exists
   * @param {sqlite3} db
   * @param {string} username
   * @returns {Promise} resolved if the user exists
   */
  userExists: async (db, username) => {
    let query = 'SELECT * FROM users WHERE username = ?';
    let result = await db.get(query, [username]);
    if (!result)
      await Promise.reject('User doesn\'t exist');
  }
};
