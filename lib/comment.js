const { getDBConnection, accessibleBug, currentDate, getLastInsertedId }  = require('./utils');

/**
 * Check whether the bug belongs to the user
 * @param {string} username
 * @param {number} cid - comment id
 */
const commentedByUser = async (db, username, cid) => {
  let query = 'SELECT * FROM comments WHERE creator = ? AND cid = ?';
  let result = await db.get(query, [username, cid]);
  if (!result)
    await Promise.reject(`The bug is not commented by ${username}`);
};

module.exports = {
  /**
   * Make a new comment on bug
   * @param {string} username
   * @param {number} bid - bug id
   * @param {string} comment - comment on bug
   * @returns {Promise} comment id
   */
  commentBug: async (username, bid, comment) => {
    let db = await getDBConnection();

    await accessibleBug(db, username, bid);

    let statement = 'INSERT INTO comments (creator, bid, \
                        comment, created_date) \
                     VALUES (?, ?, ?, ?)';
    await db.run(statement, [username, bid, comment, currentDate()]);

    // get cid
    let cid = await getLastInsertedId(db);

    await db.close();
    return cid;
  },

  /**
   * Delete a comment
   * @param {string} username
   * @param {number} cid - comment id
   * @returns {Promise} return a resolved Promise if success
   */
  deleteComment: async (username, cid) => {
    let db = await getDBConnection();

    await commentedByUser(db, username, cid);

    let statement = 'DELETE FROM comments WHERE cid = ?';
    await db.run(statement, cid);
  }
}