DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS settings;

CREATE TABLE users (
    username varchar(255),
    password varchar(16), -- AES-512 cipher text length
    salt int,
    PRIMARY KEY (username)
);
CREATE TABLE messages (
);
CREATE TABLE settings (
);