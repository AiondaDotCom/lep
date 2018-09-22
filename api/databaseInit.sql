CREATE DATABASE aiondaLEP;
USE aiondaLEP;

CREATE TABLE users (
  id          INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(100) NOT NULL,
  password    VARCHAR(100) NOT NULL,
  realname    VARCHAR(100),
  accounttype VARCHAR(100)  NOT NULL,
  accountstate VARCHAR(100),
  PRIMARY KEY (id),
  UNIQUE KEY (username)
  );

CREATE TABLE loginLog (
  id          INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(100) NOT NULL,
  action      VARCHAR(100) NOT NULL,
  error       BIT(1)       NOT NULL,
  description VARCHAR(500),
  ip          VARCHAR(50),
  timestamp   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
  );

CREATE TABLE domainWhitelist (
  id          INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  domain      VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (domain)
  );

CREATE TABLE settings (
  id    INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  settingsKey   VARCHAR(100) NOT NULL,
  settingsValue VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (settingsKey)
  );

CREATE TABLE documents (
  id          INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  uploaderID  INT(6)       UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(100),
  filesize    VARCHAR(100),
  filetype    VARCHAR(100),
  filedata    LONGBLOB,
  index documents_uploaderID_index(`uploaderID`),
  foreign key (`uploaderID`) references users(`id`) on delete cascade,
  PRIMARY KEY (id)
);

# Set databaseID
INSERT INTO settings (settingsKey, settingsValue) VALUES ('databaseID', 'mysql5@local');

# User admin@admin mit admin als Passwort
INSERT INTO users (username, password, realname, accounttype, accountstate) VALUES ('admin@admin', '$2a$10$gaPkg80LnXyW3Mn6TuHtSeQgAJ952R89YDjXixBKl0Oag0C7I75se', 'Master', 'admin', 'active');
INSERT INTO users (username, password, realname, accounttype, accountstate) VALUES ('user@admin', '$2a$10$gaPkg80LnXyW3Mn6TuHtSeQgAJ952R89YDjXixBKl0Oag0C7I75se', 'Master', 'user', 'active');
INSERT INTO users (username, password, realname, accounttype, accountstate) VALUES ('moderator@admin', '$2a$10$gaPkg80LnXyW3Mn6TuHtSeQgAJ952R89YDjXixBKl0Oag0C7I75se', 'Master', 'moderator', 'active');
