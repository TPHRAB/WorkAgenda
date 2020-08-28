const { getDBConnection } = require('./utils');

/**
 * Return current time in formate: MM-DD-YYYY
 */
const formatDate = () => {
  let d = new Date();
  let month = d.getMonth() + 1 + '',
      day = d.getDate() + '',
      year = d.getFullYear() + '';

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
};

/**
 * Check if the user is involved in the project
 * @param {db} - database connection
 * @param {string} username
 * @param {pid} pid - project id
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
   * Creat a bug
   * @param {string} username - creator
   * @param {string} bugName - bug's name
   * @param {string} status - open/closed
   * @param {string} assignee - person in charge of the bug
   * @param {string} due_date - bug's due date
   * @param {string} status - none/critical/major/minor
   * @param {string} pid - the project that the bug belongs to
   * @return {Promise} - contains error string if failed
   */
  createBug: async (username, bugTitle, status, assignee,
                    due_date, severity, pid) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    // If user is involved, create bug
    let statement = 'INSERT INTO bugs (title, reporter, created_date, status, \
                                       assignee, due_date, severity, pid) \
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await db.run(statement, [bugTitle, username, formatDate(), status,
                       assignee, due_date, severity, pid]);
    await db.close();
  },

  /**
   * Get all the bugs belongs to the project
   * @param {number} pid - pid of the project
   * @returns {Promise} - 1. If success, contains JSON in format:
   *                         [
   *                           { bug, reporter, created_date, status,
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