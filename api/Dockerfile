FROM node:8-slim

WORKDIR /srv

RUN apt update && apt -y install mysql-client

ADD package.json /srv/
ADD package-lock.json /srv/
#RUN rm -rf node_modules && npm install

RUN npm i

#ADD .privatekey /srv/
#ADD .publickey /srv/

ADD . /srv

CMD ["npm", "start"]
