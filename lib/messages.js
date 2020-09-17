const { isOwner, getDBConnection,
        createConnection, userExists } = require('./utils'),
      moment = require('moment');

/**
 * Check whether the user is the receiver of a not processed message
 * @param {sqlite3} db
 * @param {number} mid - message id
 * @param {string} username - receiver of the message
 * @returns {Promise} pid of the project that the user is invitied to join
 */
const isReceiver = async (db, mid, username) => {
  let statement = 'SELECT receiver, status, pid FROM messages WHERE mid = ?';
  let result = await db.get(statement, [mid]);
  if (!result)
    await Promise.reject('Message doesn\' exist');
  else if (result.receiver !== username)
    await Promise.reject('User is not the receiver of the message');
  else if (result.status !== 0)
    await Promise.reject('Message has already been processed');
  return result.pid;
};

module.exports = {
  /**
   * Get the user's notifications
   * @param {string} username
   * @returns {Promise} [{mid, message, status}, ...]
   */
  getMessages: async (username) => {
    let db = await getDBConnection();
    let query = 'SELECT mid, message, created_date \
                 FROM messages WHERE receiver = ? AND status = 0';
    let result = await db.all(query, [username]);
    await db.close();
    return result;
  },

  /**
   * Update notifications status
   * @param {string} username
   * @param {number} nid - notification id
   * @param {number} status - 0/1/2 (in progress, accepted, denied)
   */
  updateInvitation: async (username, mid, status) => {
    let db = await getDBConnection();

    let pid = await isReceiver(db, mid, username);
    let statement = 'UPDATE messages \
                     SET status = ? \
                     WHERE mid = ?';
    await db.run(statement, [status, mid]);

    if (status === 1) { // link the user with project
      await createConnection(db, username, pid);
    }
    await db.close();
  },

  /**
   * Create an notification for the user
   * @param {string} username
   * @param {string} message
   * @param {string} receiver
   * @returns {Promise} resolved if success
   */
  createInvitation: async (username, newUser, pid) => {
    let db = await getDBConnection();

    await isOwner(db, username, pid);
    await userExists(db, newUser);
    
    let query = 'SELECT name FROM projects WHERE pid = ?';
    let result = await db.get(query, [pid]);

    let statement = 'INSERT INTO messages \
                       (message, created_date, sender, receiver, pid) \
                     VALUES (?, ?, ?, ?, ?)';
    let message = `${username} invited you to join project ${result.name}`;
    let currentTime = moment().format('YYYY-MM-DD HH:mm');
    await db.run(statement, [message, currentTime, username, newUser, pid]);
    await db.close();
  }
};