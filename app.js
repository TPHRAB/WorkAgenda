const express = require('express');
const session = require('express-session');
const multer = require('multer');
const { login } = require('./lib/db/user');
const ClientError = require('./lib/errors/ClientError');
const user = require('./lib/db/user');
const PORT = process.env.port || 3000;

// post
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

// endpoints
app.get('/', (req, res) => {
  res.send('<h1>hello</h1>');
});

app.get('/login', (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    login(username, password);
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
