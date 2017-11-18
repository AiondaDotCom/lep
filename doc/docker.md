For local development with docker and docker-compose

# Build and deploy
```sh
docker-compose build
docker-compuse up
```

# Setup MySQL database
```sh
docker-compose run api bash
 mysql --host mysql -psuperSecure
  cerate database qgx4mamkob3zgpg7;
  use qgx4mamkob3zgpg7;
  CREATE TABLE testTable (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, name2 VARCHAR(30) NOT NULL);
  exit;
```
