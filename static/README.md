Static buildpack doku:
> https://github.com/heroku/heroku-buildpack-static


# Initialize1
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

# Scale
```sh
heroku ps:scale web=1
heroku ps:scale web=0
```
