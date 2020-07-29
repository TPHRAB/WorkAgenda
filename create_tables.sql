CREATE TABLE users (
    id int AUTO_INCREMENT,
    username varchar(255),
    password varchar(32), -- AES-256 cipher text length
    salt int,
    PRIMARY KEY (id)
);
CREATE TABLE messages (
);
CREATE TABLE settings (
);