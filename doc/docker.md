For local development with docker and docker-compose

# Build and deploy
```sh
make dev
```

# Setup MySQL database
```sh
docker-compose run api bash
 mysql --host mysql -psuperSecure
  cerate database qgx4mamkob3zgpg7;
  use qgx4mamkob3zgpg7;
  # create tables as documented in api/login.md
  exit;
```

# See also
[api/login.md](api/login.md)
