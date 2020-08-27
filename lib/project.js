const { getDBConnection } = require('./utils');

module.exports = {
  createProject: async (username, projectName, startDate,
                        endDate, overview) => {
    let db = await getDBConnection();
    let statement;

    // create a project
    statement = 'INSERT INTO \
                projects (name, owner, status, start_date, \
                          end_date, overview) \
                VALUES (?, ?, ?, ?, ?, ?)';
    await db.run(statement, [projectName, username, 'OPEN',
                            startDate, endDate, overview]);
    // get pid
    let query = 'SELECT last_insert_rowid()';
    let pid = await db.get(query);

    // link user and project
    statement = 'INSERT INTO user_projects (username, pid) VALUES (?, ?)';
    await db.run(statement, [username, pid['last_insert_rowid()']]);

    db.close();
  },

  /**
   * Get all the projects belongs to the user
   * @param {String} username
   * @return 1. If success, return JSON in format:
   *          {
   *            {name, owner, status, bugs, start_date, end_date},
   *            ...
   *          }
   *         2. If failed becasue of user, return rejected Promise containing
   *            error message
   *         3. If failed becasue of server, return Error
   */
  getProjects: async (username) => {
    let db = await getDBConnection();
    let query;
    
    // get all pid belongs to the user
    query = 'SELECT p.pid, p.name, p.owner, p.status, p.start_date, p.end_date \
             FROM user_projects AS u, projects as p \
             WHERE u.username = ? AND p.pid = u.pid';
    let result = await db.all(query, [username]);
    db.close();
    return result;
  },
  /**
   * Check if the user is involved in the project
   * @param {db} - database connection
   * @param {string} username
   * @param {pid} pid - project id
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
  }
};