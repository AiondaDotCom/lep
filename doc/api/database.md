USE qgx4mamkob3zgpg7;

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

ALTER TABLE users ADD accountstate VARCHAR(20);

ALTER TABLE users MODIFY accountstate VARCHAR(100);

SELECT * FROM users;
DELETE FROM users WHERE username='awe@some';

CREATE TABLE loginLog (
  id          INT(6)       UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(100) NOT NULL,
  action      VARCHAR(100) NOT NULL,
  error       BIT(1)       NOT NULL,
  description VARCHAR(500) ,
  timestamp   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  index loginLog_user_index(`username`),
  foreign key (`username`) references users(`username`) on delete cascade,
  PRIMARY KEY (id)
  );

  INSERT INTO loginLog (username, action, description) VALUES ('admin@admin', 'login', 'long description goes here');
  SELECT * FROM loginLog WHERE username='awe@some';

  # Erfolgreiche logins auslesen
  SELECT * FROM loginLog WHERE username='admin@admin' AND action='login' AND error=false;

  # Fehlgeschlagene logins auslesen
  SELECT * FROM loginLog WHERE username='admin@admin' AND action='login' AND error=false;

  # Die letzten beiden erfolgreichen logins herausfinden
  SELECT * FROM loginLog WHERE username='admin@admin' AND action='login' AND error=false ORDER BY timestamp DESC LIMIT 2;
