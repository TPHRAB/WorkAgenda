DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_projects;
DROP TABLE IF EXISTS bugs;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username varchar(255) NOT NULL,
    password varchar(16) NOT NULL, -- AES-256 cipher text length
    salt int NOT NULL,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    last_active_date varchar(10),
    PRIMARY KEY (username)
);

CREATE TABLE sessions (
  sid TEXT,
  expired INTEGER,
  sess TEXT,
  PRIMARY KEY (sid)
);

CREATE TABLE projects (
  pid INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- Project name
  owner varchar(255),
  status INTEGER DEFAULT 0, -- 0, 1 (ACTIVE, CLOSE)
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
  title TEXT, --bug title
  reporter varchar(255),
  created_date varchar(10), -- YYYY-MM-DD
  status INTEGER DEFAULT 0, -- (0, 1) open/closed
  due_date varchar(19), -- YYYY-MM-DD
  severity INTEGER, -- (0, 1, 2, 3) none/critical/major/minor
  description TEXT,
  pid INTEGER,
  FOREIGN KEY (reporter) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES projects
);

CREATE TABLE comments (
  cid INTEGER PRIMARY KEY AUTOINCREMENT,
  creator varchar(255),
  bid INTEGER,
  comment TEXT,
  created_date varchar(23), -- YYYY-MM-DD HH:mm:ss.SSS,
  FOREIGN KEY (creator) REFERENCES users,
  FOREIGN KEY (bid) REFERENCES bugs
);

CREATE TABLE events (
  eid INTEGER PRIMARY KEY AUTOINCREMENT,
  pid INTEGER,
  title TEXT,
  start varchar(16), -- YYYY-MM-DD HH:mm
  end varchar(16), -- YYYY-MM-DD HH:mm
  FOREIGN KEY (pid) REFERENCES projects
);

CREATE TABLE messages (
  mid INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT,
  created_date varchar(16), -- YYYY-MM-DD HH:mm
  status INTEGER DEFAULT 0, -- 0/1/2 (in progress, accepted, denied)
  sender varchar(255),
  receiver varchar(255),
  pid INTEGER,
  FOREIGN KEY (sender) REFERENCES users,
  FOREIGN KEY (receiver) REFERENCES users,
  FOREIGN KEY (pid) REFERENCES project
);