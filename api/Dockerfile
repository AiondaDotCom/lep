FROM node:10.9.0 as build_api
WORKDIR /api
ADD package.json package-lock.json /api/
RUN ["npm", "ci"]
ADD . /api