const { getDBConnection, involvedInProject } = require('./utils');

/**
 * Check whether the user can access the event
 * @param {Sqlite3} db
 * @param {string} username
 * @param {number} eid - event id
 */
const accessibleEvent = async (db, username, eid) => {
  let query;
  let result;
  query = 'SELECT pid FROM events WHERE eid = ?';
  result = await db.get(query, [eid]);

  if (!result)
    await Promise.reject('eid doesn\'t exist');

  await involvedInProject(db, username, result.pid);
};

module.exports = {
  /**
   * Create event
   * @param {number} pid - project id
   * @param {string} title - event title
   * @param {string} start - start time (YYYY-MM-DD HH)
   * @param {string} end - end time (YYYY-MM-DD HH)
   * @returns {Promise} resolved if success
   */
  createEvent: async (username, pid, title, start, end) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    let statement = 'INSERT INTO events (pid, title, start, end) \
                     VALUES (?, ?, ?, ?)';
    await db.run(statement, [pid, title, start, end]);
    await db.close();
  },

  /**
   * Get events for project
   * @param {string} username
   * @param {number} pid
   * @returns {Promise} [{eid, title, start, end}, ...]
   */
  getEvents: async (username, pid) => {
    let db = await getDBConnection();

    await involvedInProject(db, username, pid);

    let query = 'SELECT eid, title, start, end FROM events WHERE pid = ?';
    let result = await db.all(query, [pid]);
    await db.close();
    return result;
  },

  /**
   * Delete a event
   * @param {string} username
   * @param {number} eid
   * @returns {Promise} resolve if success
   */
  deleteEvent: async (username, eid) => {
    let db = await getDBConnection();

    await accessibleEvent(db, username, eid);

    let query = 'DELETE FROM events WHERE eid = ?';
    await db.run(query, [eid]);
    await db.close();
  }
};