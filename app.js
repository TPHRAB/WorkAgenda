const express = require('express');
const multer = require('multer');
const { register } = require('./lib/db/db');
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
  let username = req.body.username;
  let password = req.body.password;
  res.json({
    // auth: db.checkLogin(username, password) ? 'success' : 'failure'
    hash: register()
  });
});

app.listen(PORT);
