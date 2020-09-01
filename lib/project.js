const { getDBConnection, involvedInProject, currentDate } = require('./utils');
const { getBugs } = require('./bugs');

/**
 * Get bug status for the array
 * @param {Array} bugs - bugs list
 * @returns {Array} [number of open bugs, number of closed bugs]
 */
const getBugStatus = (bugs) => {
  // get bug status
  let openBugs = 0;
  bugs.forEach(b => {
    if (b.status == 'OPEN') openBugs++;
  });
  return [openBugs, bugs.length - openBugs];
};

module.exports = {
  /**
   * Create a project
   * @param {string} username
   * @param {string} projectName
   * @param {string} startDate
   * @param {string} endDate
   * @param {string} overview
   * @returns 1. If success, end with status code 200
   *         2. if failed becasue of user, return rejected promise containing
   *            error message
   *         3. If failed becasue of server, return Error
   */
  createProject: async (username, projectName, startDate,
                        endDate, overview) => {
    let db = await getDBConnection();
    let statement;

    // create a project
    statement = 'INSERT INTO \
                projects (name, owner, start_date, \
                          end_date, overview) \
                VALUES (?, ?, ?, ?, ?)';
    await db.run(statement, [projectName, username,
                            startDate, endDate, overview]);
    // get pid
    let query = 'SELECT last_insert_rowid()';
    let pid = await db.get(query);

    // link user and project
    statement = 'INSERT INTO user_projects (username, pid) VALUES (?, ?)';
    await db.run(statement, [username, pid['last_insert_rowid()']]);

    // link user, project to notes

    await db.close();
  },

  /**
   * Get all the projects belongs to the user
   * @param {string} username
   * @returns 1. If success, return JSON in format:
   *          {
   *            {name, owner, status, bugs, start_date, end_date},
   *            ...
   *          }
   *         2. if failed becasue of user, return rejected promise containing
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
   * @returns 1. If success, return JSON in format:
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
  }
};