// imports
const express = require('express'),
  cookieParser = require('cookie-parser'),
  multer = require('multer'),
  cors = require('cors'),
  session = require('express-session'),
  SQLiteStore = require('connect-sqlite3')(session),
  { login, register } = require('./lib/user'),
  { createProject, getProjects } = require('./lib/project');

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
 *         2. If failed, return JSON:
 *            {
 *              error: 'error message'
 *            }, and status code 401
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
 *         2. If failed, end with status code 401 and return JSON:
 *            {
 *              error: 'error message'
 *            }
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
 *         2. If failed, end with status code 401 and return JSON:
 *            {
 *              error: 'error message'
 *            }
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
 *         2. If failed, end with status code 401 and return JSON:
 *            {
 *              error: 'error message'
 *            }
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
 *              {projectName, owner, status, bugs, startDate, endDate},
 *              ...
 *            }
 *         2. If failed, end with status code 401 and return JSON:
 *            {
 *              error: 'error message'
 *            }
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
 * return: 1. If success, end with status code 200.
 *         2. If failed, end with status code 401 and return JSON:
 *            {
 *              error: 'error message'
 *            }
 */
app.post(API_URL + '/portal/create-project', async (req, res) => {
  const {projectName, startDate, endDate, overview} = req.body;
  try {
    await checkLoggedin(req);
    // if logged in
    await createProject(req.session.username, projectName, startDate,
                  endDate, overview);
    res.end();
  } catch (error) {
    handleError(error, res);
  }
});

function handleError(error, res) {
  if (typeof error === 'string') {
    // Promise been rejected
    res.status(401).json({ error });
  } else {
    res.status(500).json({
      error: "Internal Server Error. Please try agin later."
    });
    console.log(error.message);
  }
}

async function checkLoggedin(req) {
  if (!req.session.username) {
    await Promise.reject('Permission denied');
  }
}

app.listen(PORT);
