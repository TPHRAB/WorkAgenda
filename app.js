// imports
const express = require('express'),
  cookieParser = require('cookie-parser'),
  multer = require('multer'),
  cors = require('cors'),
  session = require('express-session'),
  SQLiteStore = require('connect-sqlite3')(session),
  { login, register, updateNotes } = require('./lib/user'),
  { createProject, getProjects, getProjectInfo, updateProjectInfo } = require('./lib/project'),
  { createBug, getBugs } = require('./lib/bugs');

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
      await Promise.reject('Never logged in as a username');
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
 * return: 1. If success, end with status code 200 and return nothing
 *         2. If failed, end with status code 401 with error message
 */
app.get(API_URL + '/isLoggedIn', async (req, res) => {
  try {
    await checkLoggedin(req);
    // if no rejected Promise or error
    res.end();
  } catch (error) {
    handleError(error, res);
  }
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
app.get(API_URL + '/portal/get-projects', async (req, res) => {
  try {
    await checkLoggedin(req);

    // if logged in
    let result = await getProjects(req.session.username);

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
app.post(API_URL + '/portal/create-project', async (req, res) => {
  try {
    await checkLoggedin(req);

    // if logged in
    const {name, start_date, end_date, overview} = req.body;
    await createProject(req.session.username, name, start_date,
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
app.post(API_URL + '/project/create-bug', async (req, res) => {
  try {
    await checkLoggedin(req);

    const {title, description, due_date, severity, pid} = req.body;
    await createBug(req.session.username, title,
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
app.get(API_URL + '/project/get-bugs', async (req, res) => {
  try {
    await checkLoggedin(req);

    let result = await getBugs(req.session.username, req.query.pid);

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
app.get(API_URL + '/project/dashboard', async (req, res) => {
  try {
    await checkLoggedin(req);

    let result = await getProjectInfo(req.session.username, req.query.pid);
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
app.post(API_URL + '/project/update-notes', async (req, res) => {
  try {
    await checkLoggedin(req);

    const {pid, notes} = req.body;
    await updateNotes(req.session.username, pid, notes);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Usage: Update project's info
 * method: POST
 * params: pid -project id
 *         newValues - column to update (name, owner, status, start_date,
 *                     end_date, overview)
 *         (If any of the fields are provided, the original value will be
 *          overwritten. Not provided fields will remain the same)
 * return: 1. If success, end with status code 200
 *         2. If failed, end with status code 401 with error message
 */
app.post(API_URL + '/project/update-project', async (req,res) => {
  try {
    await checkLoggedin(req);

    const {pid, newValues} = req.body;
    await updateProjectInfo(req.session.username, pid, newValues);
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
    console.log(error.message);
    res.status(500).send('Internal Server Error. Please try agin later.');
  }
}

async function checkLoggedin(req) {
  if (!req.session.username) {
    await Promise.reject('Permission denied');
  }
}

app.listen(PORT);
