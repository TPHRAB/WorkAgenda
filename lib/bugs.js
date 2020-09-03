const { getDBConnection, involvedInProject, currentDate } = require('./utils');

const SEVEIRTY_LEVEL = ['NONE', 'MINOR', 'MAJOR', 'CRITICAL'];

module.exports = {
  /**
   * Creat a bug
   * @param {string} username - creator
   * @param {string} bugName - bug's name
   * @param {string} status - open/closed
   * @param {string} assignee - person in charge of the bug
   * @param {string} due_date - bug's due date
   * @param {string} status - 0/1/2/3 (none/minor/major/critical)
   * @param {string} pid - the project that the bug belongs to
   * @return {Promise} - contains error string if failed
   */
  createBug: async (username, bugTitle, assignee,
                    dueDate, severity, pid) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    // If user is involved, create bug
    let statement = 'INSERT INTO bugs (title, reporter, created_date, \
                                       assignee, due_date, severity, pid) \
                     VALUES (?, ?, ?, ?, ?, ?, ?)';
    severity = (!severity || severity < 0 || severity > SEVEIRTY_LEVEL.length) ?
                SEVEIRTY_LEVEL[0] : SEVEIRTY_LEVEL[severity];
    await db.run(statement, [bugTitle, username, currentDate(),
                       assignee, dueDate, severity, pid]);
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