const { getDBConnection, involvedInProject, currentDate, getLastInsertedId } = require('./utils');
const { getBugs } = require('./bug');

const columns = ['name', 'owner', 'status',
                  'start_date', 'end_date', 'overview'];

/**
 * Get bug status for the array
 * @param {Array} bugs - bugs list
 * @returns {Array} [number of open bugs, number of closed bugs]
 */
const getBugStatus = (bugs) => {
  // get bug status
  let openBugs = 0;
  bugs.forEach(b => {
    // 0 is open, 1 is closed
    if (b.status == 0) openBugs++;
  });
  return [openBugs, bugs.length - openBugs];
};

module.exports = {
  /**
   * Create a project
   * @param {string} username
   * @param {string} name - project name
   * @param {string} start_date
   * @param {string} end_date
   * @param {string} overview
   * @returns {Promise} 1. If success, return a resolved Promise
   *                    2. Return rejected promise containing error message
   */
  createProject: async (username, name, start_date,
                        end_date, overview) => {
    let db = await getDBConnection();
    let statement;

    // create a project
    statement = 'INSERT INTO \
                projects (name, owner, start_date, \
                          end_date, overview) \
                VALUES (?, ?, ?, ?, ?)';
    await db.run(statement, [name, username,
                            start_date, end_date, overview]);
    // get pid
    let pid = await getLastInsertedId(db);

    // link user and project
    statement = 'INSERT INTO user_projects (username, pid) VALUES (?, ?)';
    await db.run(statement, [username, pid]);

    // link user, project to notes

    await db.close();
  },

  /**
   * Get all the projects belongs to the user
   * @param {string} username
   * @returns {Promise} 1. If success, return object in format:
   *                      {
   *                        {pid, name, owner, status, bugs,
   *                         start_date, end_date},
   *                        ...
   *                      }
   *                   2. Return rejected promise containing error message
   */
  getProjects: async (username) => {
    let db = await getDBConnection();
    let query;
    
    // get all pid belongs to the user
    query = 'SELECT p.pid, p.name, p.owner, p.status, p.start_date, p.end_date \
             FROM user_projects AS u, projects as p \
             WHERE u.username = ? AND p.pid = u.pid \
             ORDER BY status, end_date';
    let result = await db.all(query, [username]);

    // add 'bugs' column
    for (let i = 0; i < result.length; i++) {
      let status = getBugStatus(await getBugs(username, result[i].pid));
      result[i].bugs = status;
    }

    await db.close();
    return result;
  },
  
  /**
   * Get project information for dashboard
   * @param {string} username
   * @param {number} pid - project id
   * @returns {Promsie} If success, return object in format:
   *          {
   *            overview,
   *            overdueWork: [
   *              {
   *                title,
   *                lateDays
   *              },
   *              ...
   *            ],
   *            upcomingWork: [
   *              {
   *                title,
   *                daysLeft
   *              },
   *              ...
   *            ],
   *            bugStatus: [open, closed]
   *            notes: [
   *              some notes,
   *              ...
   *            ]
   *          }
   */
  getProjectInfo: async (username, pid) => {
    let db = await getDBConnection();
    await involvedInProject(db, username, pid);
    let query;
    let result;

    // get Project overview
    query = 'SELECT overview FROM projects WHERE pid = ?';
    result = await db.get(query, [pid]);
    let overview = result.overview;

    let current = currentDate();

    // get overdue works
    let overdueWork = [];
    query = 'SELECT title, due_date FROM bugs \
             WHERE pid = ? AND due_date < ?';
    await db.each(query, [pid, current], (err, row) => {
      let lateDays = (new Date(current)
                     - new Date(row.due_date)) / (1000 * 60 * 60 * 24);
      lateDays = Math.round(lateDays);
      overdueWork.push({title: row.title, lateDays});
    });

    // get upcoming works
    let upcomingWork = [];
    query = 'SELECT title, due_date FROM bugs \
             WHERE pid = ? AND due_date >= ?';
    await db.each(query, [pid, current], (err, row) => {
      let daysLeft = (new Date(row.due_date)
                     - new Date(current)) / (1000 * 60 * 60 * 24);
      daysLeft = Math.round(daysLeft);
      upcomingWork.push({ title: row.title, daysLeft });
    });

    // get bug status
    let bugStatus = getBugStatus(await getBugs(username, pid));

    // get notes
    query = 'SELECT notes FROM user_projects WHERE username = ? AND pid = ?';
    result = await db.get(query, [username, pid]);
    let notes = JSON.parse(result.notes);

    await db.close();
    return {overview, overdueWork, upcomingWork, bugStatus, notes};
  },

  /**
   * Update project information
   * @param {string} username
   * @param {number} pid - project id
   * @param {Object} newValues - column to update (name, owner, status,
   *                             start_date, end_date, overview)
   *   (If any of the fields are provided, the original value will be
   *    overwritten. Not provided fields will remain the same)
   * @returns {Promise} 1. If success, return a resolved Promise
   *                    2. If failed, reject with object in format:
   *                       {
   *                         error: 'message'
   *                       }
   */
  updateProjectInfo: async (username, pid, newValues) => {
    let db = await getDBConnection();

    let columnList = '';
    let values = [];
    columns.forEach(column => {
      if (newValues[column]) { // update column
        if (values.length > 0) columnList += ',';
        columnList += `${column} = ?`;
        values.push(newValues[column]);
      }
    });
    let statement = `UPDATE projects \
                     SET ${columnList} \
                     WHERE pid = ? AND owner = ?`;
    await db.run(statement, [...values, pid, username]);
    await db.close();
  }
};