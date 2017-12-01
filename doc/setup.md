heroku buildpacks:clear
heroku buildpacks:add https://github.com/ryandotsmith/nginx-buildpack.git
heroku buildpacks:add heroku/nodejs

heroku stack:set cedar-14 -a aionda-lep-spa
