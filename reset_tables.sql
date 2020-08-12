DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS sessions;

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

CREATE TABLE messages (
);
CREATE TABLE settings (
);