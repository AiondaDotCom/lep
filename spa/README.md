# lep-spa
This is a submodule of the [Law Enforcement Portal (LEP)](https://github.com/AiondaDotCom/lep). It provides static HTML, JS and CSS files for the single page app.

## Initialize
```sh
heroku git:remote --app aionda-lep-spa
```

### Add buildpacks
The static buildpack is used to serve static HTML, CSS and JS files.
The nodejs buildpack is used to install the dependencies via yarn.
```sh
heroku buildpacks:set https://github.com/hone/heroku-buildpack-static
heroku buildpacks:add heroku/nodejs
```

## Deploy
```sh
git push heroku
#heroku static:deploy
```

## Scale
```sh
heroku ps:scale web=1
heroku ps:scale web=0
```
