const { getDBConnection, involvedInProject } = require('./utils');

module.exports = {
  /**
   * Create event
   * @param {number} pid - project id
   * @param {string} title - event title
   * @param {string} start - start time (YYYY-MM-DD HH)
   * @param {string} end - end time (YYYY-MM-DD HH)
   */
  createEvent: async (username, pid, title, start, end) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    let statement = 'INSERT INTO event (pid, title, start, end) \
                     VALUES (?, ?, ?, ?)';
    await db.run(statement, [pid, title, start, end]);
  }
};