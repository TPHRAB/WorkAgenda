const user = require('./lib/db/user');

// imports
const express = require('express'),
  cookieParser = require('cookie-parser'),
  multer = require('multer'),
  cors = require('cors'),
  session = require('express-session'),
  SQLiteStore = require('connect-sqlite3')(session),
  { login, register } = require('./lib/db/user');

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
}));

app.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    if (req.session.username) {
      await Promise.reject(`Already loggged in as ${username}`);
    }
    await login(username, password);
    // if no error caught
    req.session.username = username;
    res.json({
      loggedIn: true
    });
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/register', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    await register(username, password);
    // if no error caught
    res.json({
      registered: true
    });
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/logout', (req, res) => {
  try {
    req.session.destroy();
    res.json({
      loggedOut: true
    });
  } catch (error) {
    handleError(error, res);
  }
});

function handleError(error, res) {
  if (error instanceof Error) {
    res.status(500).json({
      error: "Internal Server Error. Please try agin later."
    });
    console.log(error.message);
  } else {
    // Promise been rejected
    res.status(401).json({ error });
  }
}

app.listen(PORT);
