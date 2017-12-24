FROM node

WORKDIR /src

RUN apt update && apt upgrade -y
RUN apt install -y git

RUN npm -g config set user root
RUN npm install -g yarn
RUN npm install -g @angular/cli
