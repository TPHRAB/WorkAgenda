const { getDBConnection, involvedInProject,
        currentDate, accessibleBug } = require('./utils');

const columns = ['title', 'status', 'due_date', 'severity', 'description'];

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
   *                             due_date, severity },
   *                           ...
   *                         ]
   *                      2. If failed, rejected with an error string
   *                         inside of the Promise
   */
  getBugs: async (username, pid) => {
    let db = await getDBConnection();
    await involvedInProject(db, username, pid);

    // If user is involved, return all bugs
    let query = 'SELECT bid, title, reporter, created_date, \
                        status, due_date, severity FROM bugs \
                 WHERE pid = ? \
                 ORDER BY status, due_date';
    let result = db.all(query, [pid]);
    await db.close();
    return result;
  },

  /**
   * Get bug information for the edit bug page
   * @param {string} username
   * @param {number} pid - project id
   * @param {number} bid - bug id
   * @returns {Promise} { title, reporter, created_date,
   *                      description, status, due_date, severity, comments }
   */
  getBugInfo: async (username, bid) => {
    let db = await getDBConnection();
    let query;

    await accessibleBug(db, username, bid);

    // get bug's info
    query = 'SELECT title, reporter, created_date, \
                        description, status, due_date, severity \
                 FROM bugs \
                 WHERE bid = ?';
    let info = await db.get(query, [bid]);

    // get bug's comments
    query = 'SELECT creator, comment, created_date \
             FROM comments \
             WHERE bid = ? \
             ORDER BY created_date DESC';
    let comments = await db.all(query, [bid]);

    await db.close();
    return {...info, comments};
  },

  /**
   * Edit a bug
   * @param {username} user - user editing the bug
   * @param {number} bid - bug id
   * @param {Object} newValues - {title, status,
   *    due_date, severity, description} (set columns to these values)
   * @returns {Promsie} resolve if success
   */
  editBug: async (username, bid, newValues) => {
    let db = await getDBConnection();
    let query;

    await accessibleBug(db, username, bid);

    let columnList = '';
    let values = [];
    columns.forEach((column, index) => {
      if (newValues[column] || newValues[column] === 0) {
        if (index > 0) columnList += ',';
        columnList += `${column} = ?`;
        values.push(newValues[column]);
      }
    });

    query = `UPDATE bugs \
             SET ${columnList} \
             WHERE bid = ?`;
    await db.run(query, [...values, bid]);

    await db.close();
  },

  /**
   * Make a new comment on bug
   * @param {string} username
   * @param {number} bid - bug id
   * @param {string} comment - comment on bug
   * @returns {Promise} resolve if success
   */
  commentBug: async (username, bid, comment) => {
    let db = await getDBConnection();

    await accessibleBug(db, username, bid);

    let statement = 'INSERT INTO \
                     comments (creator, bid, comment, created_date) \
                     VALUES (?, ?, ?, ?)';
    await db.run(statement, [username, bid, comment, currentDate()]);
    await db.close();
  }
};