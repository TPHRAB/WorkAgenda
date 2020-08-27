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
  owner varchar(255),
  status varchar(6), -- ACTIVE or CLOSE
  start_date varchar(10), -- MM-DD-YYYY
  end_date varchar(19), -- MM-DD-YYYY hh:mm AM/PM
  overview TEXT, -- Project overview
  FOREIGN KEY (owner) REFERENCES users
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
  title TEXT, --bug title
  reporter varchar(255),
  created_date varchar(10), -- MM-DD-YYYY
  status varchar(11), -- open/in progress/closed
  assignee varchar(255),
  due_date varchar(19), -- MM-DD-YYYY hh:mm AM/PM
  severity varchar(8), -- none/critical/major/minor
  pid INTEGER,
  FOREIGN KEY (reporter) REFERENCES users,
  FOREIGN KEY (assignee) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES projects
);