const { createEvent, getEvents, deleteEvent } = require('./lib/event');

// imports
const express = require('express'),
  cookieParser = require('cookie-parser'),
  multer = require('multer'),
  cors = require('cors'),
  session = require('express-session'),
  SQLiteStore = require('connect-sqlite3')(session),
  { login, register, updateNotes,
    updateLastOnlineDate } = require('./lib/user'),
  { createProject, getProjects, getProjectInfo,
    updateProjectInfo, addUserToProject,
    getProjectUsers, getProjectSettings,
    removeProjectUser} = require('./lib/project'),
  { createBug, getBugs, editBug, getBugInfo, deleteBug } = require('./lib/bug'),
  { commentBug, deleteComment } = require('./lib/comment');

// initialize server
const PORT = process.env.port || 3001;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());
app.use(cookieParser());
app.use(session({
  store: new SQLiteStore({
    db: 'database.db',
    table: "sessions"
  }),
  secret: 'your secret',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  resave: false,
  saveUninitialized: false,
}));
const API_URL = '/api';

/**
 * usage: Login an account
 * method: POST
 * params: username, password
 * return: 1. If success, status code 200 and return nothing
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    if (req.session.username && req.session.username != username) {
      // if already logged in
      await Promise.reject(`Already logged in as ${req.session.username}`);
    }
    // if not logged in
    await login(username, password);
    // if no error
    req.session.username = username;
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Register an account
 * method: POST
 * params: username, password, first name, last name
 * return: 1. If success, end with status code 200 and return nothing
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/register', async (req, res) => {
  const {username, password, firstName, lastName} = req.body;
  try {
    await register(username, password, firstName, lastName);
    // if no error
    req.session.username = username;
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Logout an accout
 * method: GET
 * return: 1. If success, end with status code 200 and return nothing
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/logout', async (req, res) => {
  try {
    if (!req.session.username) {
      await Promise.reject('You haven\'t logged in');
    }
    req.session.destroy();
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Check whether user is logged in
 * method: GET
 * return: 1. If logged-in, return the username
 *         2. If not logged-in, return null
 */
app.get(API_URL + '/logged-in-username', async (req, res) => {
  res.send(req.session.username);
});

/**
 * usage: Get all the projects that the user is involved
 * method: GET
 * return: 1. If success, return JSON:
 *            {
 *              {pid, name, owner, status, bugs, startDate, endDate},
 *              ...
 *            }
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/get-projects', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    // if logged in
    let result = await getProjects(username);

    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Create a project and set the loggedin user to be its owner
 * method: POST
 * params: projectName, startDate, endDate, overview
 * return: 1. If success, end with status code 200.
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/create-project', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    // if logged in
    const {name, start_date, end_date, overview} = req.body;
    await createProject(username, name, start_date,
                  end_date, overview);

    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Create a bug
 * method: POST
 * params: bugTitle,
 *         assignee,
 *         due_date,
 *         severity: 0/1/2/3 (none/minor/major/critical),
 *                   values out of range will be considered to be 0
 *         pid
 * return: 1. If success, end with status code 200.
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/create-bug', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const {title, description, due_date, severity, pid} = req.body;
    await createBug(username, title,
                    description, due_date, severity, pid);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Get all the bugs belong to the project
 * method: POST
 * params: pid
 * return: 1. If success, return JSON in format:
 *            [
 *              { bid, title, reporter, created_date, status,
 *                assignee, due_date, severity },
 *              ...
 *            ]
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/get-bugs', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    let result = await getBugs(username, req.query.pid);

    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Get all the bugs belong to the project
 * method: POST
 * params: pid
 * return: 1. If success, return JSON in format:
 *            {
 *              overview,
 *              overdueWork: [
 *                {
 *                  title,
 *                  lateDays
 *                },
 *                ...
 *              ],
 *              upcomingWork: [
 *                {
 *                  title,
 *                  daysLeft
 *                },
 *                ...
 *              ],
 *              bugStatus: [open, closed]
 *              notes: [
 *                some notes,
 *                ...
 *              ]
 *            }
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/dashboard', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    let result = await getProjectInfo(username, req.query.pid);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

app.get(API_URL + '/get-project-settings', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { pid } = req.query;
    let result = await getProjectSettings(username, pid);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Update user's notes in project
 * method: POST
 * params: pid - project id,
 *         notes - JSON list in format [note1, ...]
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/update-notes', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const {pid, notes} = req.body;
    await updateNotes(username, pid, notes);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Update project's info
 * method: POST
 * params: pid - project id
 *         newValues - { name, owner, status, start_date, end_date, overview }
 *                     (not null values will be used to overwritten value in db)
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/update-project', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const {pid, newValues} = req.body;
    await updateProjectInfo(username, pid, newValues);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Edit the bug's information
 * method: POST
 * params: pid - project id
 *         bid - bug id
 *         newValues - { title, description, status, due_date, severity }
 *                     (not null values will be used to overwritten value in db)
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/edit-bug', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { bid, newValues } = req.body;
    await editBug(username, bid, newValues);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * usage: Post to comment to a bug
 * method: POST
 * params: bid - bug id
 *         comment - comment message
 * return: 1. If success, end with status code 200.
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/comment-bug', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { bid, comment } = req.body;
    let cid = await commentBug(username, bid, comment);
    res.send('' + cid);
  } catch (error) {
    handleError(error, res);
  }
});


/**
 * Usage: Get bug's information
 * method: GET
 * params: pid - project id
 *         bid - bug id
 * return: 1. If success, return JSON in format:
 *            { title, description, status, due_date, severity }
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/get-bug-info', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { bid } = req.query;
    let result = await getBugInfo(username, bid);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: delete a bug
 * Method: GET
 * params: bid - bug id
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/delete-bug', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { bid } = req.query;
    await deleteBug(username, bid);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: delete a comment
 * Method: GET
 * Params: cid - comment id
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/delete-comment', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { cid } = req.query;

    await deleteComment(username, cid);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Create an event
 * Method: POST
 * Params: pid - project id
 *         title - event title
 *         start - start time in format YYYY-MM-DD HH:mm
 *         end - end time in format YYYY-MM-DD HH:mm
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/create-event', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { pid, title, start, end } = req.body;

    await createEvent(username, pid, title, start, end);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Get all events belong to the project
 * Method: GET
 * Params: pid - project id
 * return: 1. If success, return JSON in format [{eid, title, start, end}, ...]
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/get-events', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { pid } = req.query;

    let result = await getEvents(username, pid);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Delete an event
 * Method: GET
 * Params: eid - event id
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/delete-event', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { eid } = req.query;
    await deleteEvent(username, eid);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Add user to project
 * Method: POST
 * Params: pid - project id
 *         newUser - new user's username
 * Return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/add-user', async (req, res) => {
  try {
    let username = await checkLoggedin(req);
    
    const { pid, newUser } = req.body;
    await addUserToProject(username, pid, newUser);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Get users involved in the project
 * Method: GET
 * Params: pid - project id
 * Return: 1. If success, return JSON in format:
 *            [{username, first_name, last_name, last_active_date}, ...]
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/get-project-users', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { pid } = req.query;
    let result = await getProjectUsers(username, pid);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Remove a user from the project
 * Method: POST
 * Params: pid - project id
 *         userToRemove - user to be removed from the project
 * Return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/remove-project-user', async (req, res) => {
  try {
    let username = await checkLoggedin(req);

    const { pid, userToRemove } = req.body;
    await removeProjectUser(username, pid, userToRemove);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

function handleError(error, res) {
  if (typeof error === 'string') {
    // Promise been rejected
    res.status(401).send(error);
  } else {
    console.log(error);
    res.status(500).send('Internal Server Error. Please try agin later.');
  }
}

/**
 * @returns {Promise} - 1. If logged in, return username
 *                      2. If not logged in, return null
 */
async function checkLoggedin(req) {
  let username = req.session.username;
  if (!username)
    await Promise.reject('Permission denied');

  // update last logged in time
  await updateLastOnlineDate(username);
  return username;
}

app.listen(PORT);
