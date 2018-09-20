FROM node:10.9.0-alpine as build_spa
WORKDIR /spa
ADD package.json package-lock.json /spa/
RUN ["npm", "ci"]
ADD . /spa
RUN ["/spa/node_modules/.bin/ng", "build", "--prod"]