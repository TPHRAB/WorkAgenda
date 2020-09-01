const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

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
   * Check if the user is involved in the project
   * @param {db} - database connection
   * @param {string} username
   * @param {number} pid - project id
   * @return {Promise}
   */
  involvedInProject: async (db, username, pid) => {
      // check pid exist and the user is involved
      let query = 'SELECT * FROM user_projects WHERE username = ? AND pid = ?';
      let userInvolved = await db.get(query, [username, pid]);
      if (!userInvolved) {
          // if the user aren't involved in the project
          await Promise.reject(`${username} isn't involved in project ${pid}`);
      }
  },

  /**
   * Return current time in formate: YYYY-MM-DD
   */
  currentDate: () => {
    let d = new Date();
    let month = d.getMonth() + 1 + '',
        day = d.getDate() + '',
        year = d.getFullYear() + '';

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
};
