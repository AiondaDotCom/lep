# User management
## Create user
```sh
curl 'localhost/api/user/create?name=test&password=changeme'
```

## Delete user
```sh
curl 'localhost/api/user/delete?name=test&password=changeme'
```

## Change password
```sh
curl 'localhost/api/user/modify?name=test&password=changeme&newpassword=42'
```

# Login

## Request JWT using username and password
```sh
curl 'localhost/api/user/login?name=testA&password=changeme'
```

## Access a restricted resource
The parameter jwt is the string returned by the login/ endpoint
```sh
curl 'localhost/api/restricted?jwt=<JSON_WEB_TOKEN>'
```


# Database structure
## User credentials database
ID (autoincrement) | Username (email) | Password (encrypted) | Real name | Date of registration | Last login ? | accounttype

```
CREATE TABLE users (
  id INT(6) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  realname VARCHAR(50),
  accounttype VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`username`)
  );
```

```
mysql> DESCRIBE users;
+-------------+-----------------+------+-----+---------+----------------+
| Field       | Type            | Null | Key | Default | Extra          |
+-------------+-----------------+------+-----+---------+----------------+
| id          | int(6) unsigned | NO   | PRI | NULL    | auto_increment |
| username    | varchar(100)    | NO   | UNI | NULL    |                |
| password    | varchar(100)    | NO   |     | NULL    |                |
| realname    | varchar(50)     | YES  |     | NULL    |                |
| accounttype | varchar(10)     | NO   |     | NULL    |                |
+-------------+-----------------+------+-----+---------+----------------+
```

## Useful commands
```
DESCRIBE users;
SELECT * FROM users;

ALTER TABLE users ADD UNIQUE (username);
ALTER TABLE users MODIFY password VARCHAR(100);
```
