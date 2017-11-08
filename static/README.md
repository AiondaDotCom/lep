
# Initialize
```sh
heroku git:remote --app aionda-lep-spa
```

```sh
heroku buildpacks:set https://github.com/hone/heroku-buildpack-static
```

# Deploy
```sh
heroku static:deploy
```
