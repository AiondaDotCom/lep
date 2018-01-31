For local development with docker and docker-compose

# Preparations
Copy the file `api.env` and adapt it to fit your setup.
Please use the keypair only for testing.
Generate your own for production.
```sh
cp api.env api.dev.env # Configuration for development setup
cp api.env api.prod.env # Configuration for production
```


# Build and deploy
```sh
source api.dev.env # Export the environment variables
make dev
```

# Test the project
```sh
source api.dev.env
make test
```

# Setup MySQL database
```sh
docker-compose run api mysql --host mysql -psuperSecure
  cerate database qgx4mamkob3zgpg7;
  use qgx4mamkob3zgpg7;
  # create tables as documented in api/login.md
  CREATE TABLE users (
    id INT(6) UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    realname VARCHAR(50),
    accounttype VARCHAR(10) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`username`)
    );
  exit;
```

# See also
[api/login.md](api/login.md)
