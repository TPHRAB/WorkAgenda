'use strict';

const PORT = 3001;

// initialize server
const express = require('express');
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite');

// post
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const multer = require('multer');
app.use(multer().none());

// database
async function getDBConnection() {
    const db = await sqlite.open({
        filename: './database.db', 
        driver: sqlite3.Database
    })
    return db;
}


// endpoints
app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
})


app.listen(PORT)