DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_projects;
DROP TABLE IF EXISTS bugs;

CREATE TABLE users (
    username varchar(255) NOT NULL,
    password varchar(16) NOT NULL, -- AES-512 cipher text length
    salt int NOT NULL,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
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
  name TEXT NOT NULL, -- Project name
  owner varchar(255),
  status varchar(6) DEFAULT 'ACTIVE', -- ACTIVE or CLOSE
  start_date varchar(10) NOT NULL, -- YYYY-MM-DD
  end_date varchar(19) DEFAULT 'N/A', -- YYYY-MM-DD hh:mm AM/PM
  overview TEXT DEFAULT '', -- Project overview
  FOREIGN KEY (owner) REFERENCES users
);

CREATE TABLE user_projects (
  username varchar(255),
  pid INT,
  notes TEXT DEFAULT '[]', -- JSON list
  FOREIGN KEY (username) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES projects,
  PRIMARY KEY (username, pid)
);

CREATE TABLE bugs (
  bid INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, --bug title
  reporter varchar(255),
  created_date varchar(10) NOT NULL, -- YYYY-MM-DD
  status varchar(11) DEFAULT 'OPEN', -- open/in progress/closed
  assignee varchar(255),
  due_date varchar(19) DEFAULT 'N/A', -- YYYY-MM-DD hh:mm AM/PM
  severity varchar(8) NOT NULL, -- none/critical/major/minor
  pid INTEGER,
  FOREIGN KEY (reporter) REFERENCES users,
  FOREIGN KEY (assignee) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES projects
);