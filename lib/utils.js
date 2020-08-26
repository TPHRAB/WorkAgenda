const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

module.exports = {
  /**
   * Get database connection
   * @returns {db} - Sqlite connector
   */
  getDBConnection: async () => {
    const db = await sqlite.open({
      filename: './database.db',
      driver: sqlite3.Database
    });
    return db;
  }
};
