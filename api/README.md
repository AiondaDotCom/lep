# lep-api
This is a submodule of the [Law Enforcement Portal (LEP)](https://github.com/AiondaDotCom/lep). It provides the api.


## Setup
```sh
heroku git:remote -a aionda-lep-api
```

## Heroku set buildpack
```sh
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs -a aionda-lep-api
```

## Generate RSA SHA256 keypair
```sh
openssl genrsa -out private.key 2048
# Extract public key:
openssl rsa -pubout -in private.key -out public_key.pem
```