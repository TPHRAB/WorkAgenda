// imports
const express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  SQLiteStore = require('connect-sqlite3')(session),
  { login } = require('./lib/db/user'),
  ClientError = require('./lib/errors/ClientError');

// initialize server
const PORT = process.env.port || 3000;
const app = express();
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  store: new SQLiteStore({
    db: 'database.db',
    table: "sessions"
  }),
  secret: 'your secret',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
}));

// Endpoints
app.get('/', (req, res) => {
});

app.post('/login', (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    login(username, password);
    // to do

  } catch (error) {
    if (error instanceof ClientError) {
      res.status(401).json({
        error: ClientError.message
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error. Please try agin later."
      });
    }
  }
});

app.listen(PORT);
