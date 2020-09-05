const { getDBConnection, involvedInProject, currentDate } = require('./utils');

module.exports = {
  /**
   * Creat a bug
   * @param {string} username - creator
   * @param {string} title - bug's title
   * @param {string} description - bug's description
   * @param {string} due_date - bug's due date
   * @param {string} severity - 0/1/2/3 (none/minor/major/critical)
   * @param {string} pid - the project that the bug belongs to
   * @return {Promise} - contains error string if failed
   */
  createBug: async (username, title, description,
                    due_date, severity, pid) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    // If user is involved, create bug
    let statement = 'INSERT INTO bugs (title, reporter, created_date, \
                                       due_date, severity, \
                                       description, pid) \
                     VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.run(statement, [title, username, currentDate(),
                       due_date, severity, description, pid]);
    await db.close();
  },

  /**
   * Get all the bugs belongs to the project
   * @param {number} pid - pid of the project
   * @returns {Promise} - 1. If success, contains JSON in format:
   *                         [
   *                           { bid, title, reporter, created_date, status,
   *                             assignee, due_date, severity },
   *                           ...
   *                         ]
   *                      2. If failed, rejected with an error string
   *                         inside of the Promise
   */
  getBugs: async (username, pid) => {
    let db = await getDBConnection();
    await involvedInProject(db, username, pid);

    // If user is involved, return all bugs
    let query = 'SELECT * FROM bugs WHERE pid = ?';
    let result = db.all(query, [pid]);
    await db.close();
    return result;
  }
};