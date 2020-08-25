DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_projects;
DROP TABLE IF EXISTS bugs;

CREATE TABLE users (
    username varchar(255),
    password varchar(16), -- AES-512 cipher text length
    salt int,
    first_name TEXT,
    last_name TEXT,
    PRIMARY KEY (username)
);

CREATE TABLE sessions (
  sid TEXT,
  expired INTEGER, -- Date().getTime()
  sess TEXT,
  PRIMARY KEY (sid)
);

CREATE TABLE projects (
  pid INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, -- Project name
  overview TEXT -- Project overview
);

CREATE TABLE user_projects (
  username varchar(255),
  pid INT,
  FOREIGN KEY (username) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES projects,
  PRIMARY KEY (username, pid)
);

CREATE TABLE bugs (
  bid INTEGER PRIMARY KEY AUTOINCREMENT,
  pid INTEGER,
  FOREIGN KEY (pid) REFERENCES projects
);