# Buildpacks
This App uses two buildpacks:
1. `heroku-buildpack-nginx`
  * Used to serve the static content (HTML, CSS, JS)
  * Proxies request to the API (`https://your-app.herokuapp.com/api/`)
  * Enforces encrypted https connection by redirecting http requests to https
2. `nodejs`
  * Installs the required JS packages used by the single page application and the NodeJS App itself
  * Serves the API

```sh
heroku buildpacks:clear
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nginx
heroku buildpacks:add heroku/nodejs
```

# Environment variables

## Generate RSA SHA256 keypair
```sh
openssl genrsa -out private.key 2048
# Extract public key:
openssl rsa -pubout -in private.key -out public_key.pem
```

# Set environment variables
```sh
heroku config:set SERVER_NAME=       # Domain of this app eg. myapp.herokuapp.com
heroku config:set DEVEL_PRIVATE_KEY= # Prive part of RSA-Key (content of private.key)
heroku config:set DEVEL_PUBLIC_KEY=  # Public part of RSA-key (content of public_key.pem)

# The following variables should be set by provisioning the corresponding Heroku-addons
#heroku config:set JAWSDB_URL=<...>
#heroku config:set SENDGRID_API_KEY=<...>
#heroku config:set SENDGRID_PASSWORD=<...>
#heroku config:set SENDGRID_USERNAME=<...>
```

Verify if everything is set up properly
```sh
heroku config
```
